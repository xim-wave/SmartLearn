/*
=============================================================
*Archivo: mazoController.js
*Descripción: Controlador para la gestión de Mazos de estudio
*Contiene las funciones para crear nuevos mazos
*y consultar los mazos existentes en la base de datos Supabase
==============================================================
*/

// importar la llave para comunicar con la base de datos
const { supabase } = require('../services/supabaseClient');

// funcion "crear mazo"
const crearMazo = async(req, res) => {
    try {
        // 🛡️ ESCUDO 1: Extraemos tanto "titulo" como "nombre" por si acaso.
        const { titulo, nombre, descripcion } = req.body;
        
        // Si el front manda "nombre", usamos "nombre". Si manda "titulo", usamos "titulo".
        const nombreFinal = nombre || titulo || 'Sin título';

        // extrae el ID del usuario directamente del cliente autenticado
        const { data: { user } } = await req.supabaseClient.auth.getUser();
        const usuario_id = user.id;

        // nos comunicamos con supabase para instertar una nueva fila en la tabla de mazos
        const { data, error } = await req.supabaseClient
            .from('mazos')
            .insert([{ nombre: nombreFinal, descripcion: descripcion || 'Sin descripción', usuario_id: usuario_id }])
            .select();

        // aviso de error en DB
        if (error) throw error;

        // respuesta del usuario que mandó los datos
        res.status(201).json({
            status: 201,
            mensaje: "¡Mazo creado con éxito!",
            mazo: data[0]
        });

    } catch (error) {
        console.error("Error al crear el mazo", error.message);
        res.status(500).json({error: error.message});
    }
};

// funcion para obtener todos los mazos
const obtenerMazos = async (req, res) => {
    try {
        // 1. Hacemos la consulta relacional. 
        // Le pedimos todo del mazo (*) y que cuente las flashcards asociadas.
        const { data, error } = await req.supabaseClient
            .from('mazos')
            .select('*, flashcards(count)');

        if (error) throw error;

        // 2. Supabase devuelve la cuenta en un formato algo anidado: { flashcards: [{ count: 5 }] }
        // Vamos a "limpiarlo" para que tu frontend lo reciba mucho más fácil:
        const mazosConConteo = data.map(mazo => {
            // Extraemos el número (si no tiene tarjetas o la relación falla, ponemos 0)
            const cantidad = mazo.flashcards && mazo.flashcards[0] ? mazo.flashcards[0].count : 0;
            
            // Borramos la propiedad fea de flashcards y le ponemos una limpia
            delete mazo.flashcards; 
            
            return {
                ...mazo,
                cantidad_tarjetas: cantidad // <--- Esta es la nueva propiedad
            };
        });

        res.status(200).json({
            status: 200,
            mensaje: "Mazos recuperados.",
            mazos: mazosConConteo
        });
    } catch (error){
        console.error("Error al obtener los mazos", error.message);
        res.status(500).json({error: error.message});
    }
};

// funcion editar un mazo existente
const editarMazo = async(req, res) => {
    try {
        const { id } = req.params; // saca del ID del mazo de la URL
        const { titulo, nombre, descripcion } = req.body;
        const nombreFinal = nombre || titulo;

        const { data, error } = await req.supabaseClient
            .from('mazos')
            .update({ nombre: nombreFinal, descripcion: descripcion })
            .eq('mazo_id', id) // 👈 REGRESAMOS ESTO A 'mazo_id'
            .select();

        if (error) throw error;

        res.status(200).json({
            status: 200,
            mensaje: "Mazo actualizado correctamente.",
            mazo: data[0]
        });

    } catch(error) {
        console.error("Error al editar el mazo: ", error.message);
        res.status(500).json({error: error.message});
    }
};

// Funcion para eliminar un mazo
const eliminarMazo = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await req.supabaseClient
            .from('mazos')
            .delete()
            .eq('mazo_id', id); // 👈 REGRESAMOS ESTO A 'mazo_id'

        if (error) throw error;

        res.status(200).json({
            status:200,
            mensaje: "Mazo eliminado con éxito"
        });

    } catch(error) {
        console.error("Error al eliminar el mazo: ", error.message);
        res.status(500).json({error: error.message});
    }
};

// Función para obtener un solo mazo por su ID
const obtenerMazoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await req.supabaseClient
            .from('mazos')
            .select('*')
            .eq('mazo_id', id) // o 'id' si tu columna se llama así
            .single(); // .single() le dice a Supabase que solo traiga un objeto, no un arreglo

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error("Error al obtener el mazo:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// exportamos la funcion para que las rutas la puedan usar
module.exports = { crearMazo, obtenerMazos, editarMazo, eliminarMazo, obtenerMazoPorId };