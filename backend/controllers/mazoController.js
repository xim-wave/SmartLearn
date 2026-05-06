/*
=============================================================
*Archivo: mazoController.js
*Descripción: Controlador para la gestión de Mazos de estudio
*Contiene las funciones para crear nuevos mazos
*y consultar los mazos existentes en la base de datos Supabase
==============================================================
*/

// importar la llave para comunicar con la base de datos
const supabase = require('../services/supabaseClient');

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
        const { data, error } = await req.supabaseClient
            .from('mazos')
            .select('*');

        if (error) throw error;

        res.status(200).json({
            status: 200,
            mensaje: "Mazos recuperados.",
            mazos: data
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
            // 🛡️ ESCUDO 2: Supabase por defecto llama a la columna de ID solo "id", no "mazo_id".
            .eq('id', id) 
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
            // 🛡️ ESCUDO 2: Cambiado de 'mazo_id' a 'id'
            .eq('id', id);

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

// exportamos la funcion para que las rutas la puedan usar
module.exports = { crearMazo, obtenerMazos, editarMazo, eliminarMazo };