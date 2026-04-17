/*
================================================================
*Archivo: recursoController.js
*Descripcion: Sube materiales de apoyo (PDF/Imagenes) a Supabase
*y los vincula directamente a un Mazo en especifico
=================================================================
*/

const supabase = require('../services/supabaseClient');

const agregarRecursoAMazo = async(req, res) =>{
    try{
        const {mazo_id} = req.params;

        if(!req.file){
            return res.status(400).json({error: "No se detecto ningun archivo"});
        }

        //Subir al bucket supabase
        const nombreArchivo = `${Date.now()}_${req.file.originalname}`;
        const {data: uploadData, error: uploadError} = await supabase.storage
        .from('recursos-estudio')
        .upload(nombreArchivo, req.file.buffer,{
            contentType: req.file.mimetype
        });

        if(uploadError) throw uploadError;

        //toma la URL publica
        const{data: {publicUrl} } = supabase.storage
        .from('recursos-estudio')
        .getPublicUrl(nombreArchivo);

        //calcula los metadatos (peso y tipo)
        const pesoCalculado = parseFloat((req.file.size / (1024*1024)).toFixed(2));
        const tipoCalculado = req.file.mimetype === 'application/pdf' ? 'PDF' : 'Imagen';

        //guardar en tabla 'recursos' vinculandolo al mazo
        const {data, error} = await supabase
        .from('recursos')
        .insert([{
            mazo_id: mazo_id,
            url_recurso: publicUrl,
            peso_mb: pesoCalculado,
            tipo_recurso: tipoCalculado
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

module.exports = {agregarRecursoAMazo};