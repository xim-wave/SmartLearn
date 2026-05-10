/*
================================================================
*Archivo: recursoController.js
*Descripcion: Sube materiales de apoyo (PDF/Imagenes) a Supabase
*y los vincula directamente a un Mazo en especifico
=================================================================
*/

const { supabaseAdmin } = require('../services/supabaseClient');

const agregarRecursoAMazo = async(req, res) =>{
    try{
        const {mazo_id} = req.params;

        if(!req.file){
            return res.status(400).json({error: "No se detecto ningun archivo"});
        }

        // --- 1. SUBIR AL BUCKET ---
        const nombreArchivo = `${Date.now()}_${req.file.originalname}`;
        const {data: uploadData, error: uploadError} = await supabaseAdmin.storage
        .from('recursos-estudio')
        .upload(nombreArchivo, req.file.buffer,{
            contentType: req.file.mimetype
        });

        if(uploadError) throw uploadError;

        // --- 2. TOMAR URL PÚBLICA ---
        const{data: {publicUrl} } = supabaseAdmin.storage
        .from('recursos-estudio')
        .getPublicUrl(nombreArchivo);

        // Calcula metadatos según el esquema
        const pesoCalculado = parseFloat((req.file.size / (1024*1024)).toFixed(2));
        // El check del SQL solo acepta 'url' o 'pdf' (en minúsculas)
        const tipoCalculado = 'pdf'; 

        // --- 3. GUARDAR EN LA TABLA (CON NOMBRES EXACTOS DEL SQL) ---
        const {data, error} = await supabaseAdmin
        .from('recursos')
        .insert([{
            mazo_id: mazo_id,
            tipo: tipoCalculado,      // Antes: tipo_recurso
            url_o_ruta: publicUrl,    // Antes: url_recurso
            nombre: req.file.originalname, // ¡Agregado! Es obligatorio
            tamanio_mb: pesoCalculado  // Antes: peso_mb
        }])
        .select();

        if(error) throw error;

        res.status(200).json({
            status:200,
            mensaje: 'Recurso guardado y vinculado al Mazo exitosamente',
            recurso: data[0]
        });

    } catch(error){
        console.error("Error al subir el recurso.", error.message);
        res.status(500).json({error: error.message});
    }
};

// --- NUEVA FUNCIÓN PARA TRAER LOS RECURSOS ---
const obtenerRecursosPorMazo = async (req, res) => {
    try {
        const { mazo_id } = req.params;

        // Buscamos en la tabla 'recursos' todos los que coincidan con el mazo_id
        const { data, error } = await supabaseAdmin
            .from('recursos')
            .select('*')
            .eq('mazo_id', mazo_id)
            
        if (error) throw error;

        // Le mandamos la lista al frontend
        res.status(200).json(data);

    } catch (error) {
        console.error("Error al obtener los recursos.", error.message);
        res.status(500).json({ error: error.message });
    }
};

// --- NUEVA FUNCIÓN PARA ELIMINAR UN RECURSO ---
const eliminarRecurso = async (req, res) => {
    try {
        const { recurso_id } = req.params;

        // Opcional (pero muy profesional): Obtener el recurso antes de borrarlo 
        // para también borrar el archivo físico del bucket de Supabase
        const { data: recursoInfo, error: fetchError } = await supabaseAdmin
            .from('recursos')
            .select('url_o_ruta')
            .eq('recurso_id', recurso_id)
            .single();

        if (!fetchError && recursoInfo) {
            // Extraemos el nombre exacto del archivo desde la URL para borrarlo del bucket
            const urlParts = recursoInfo.url_o_ruta.split('/');
            const nombreArchivoEnBucket = urlParts[urlParts.length - 1];
            
            await supabaseAdmin.storage
                .from('recursos-estudio')
                .remove([nombreArchivoEnBucket]);
        }

        // Ahora sí, lo borramos de la base de datos
        const { error } = await supabaseAdmin
            .from('recursos')
            .delete()
            .eq('recurso_id', recurso_id);

        if (error) throw error;

        res.status(200).json({ mensaje: 'Recurso eliminado correctamente' });

    } catch (error) {
        console.error("Error al eliminar el recurso:", error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { agregarRecursoAMazo, obtenerRecursosPorMazo, eliminarRecurso };