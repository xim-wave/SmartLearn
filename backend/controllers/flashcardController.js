/*
==============================================================
*Archivo: flashcardController.js
*Descripción: Controlador central de las Flashcards
*Encargada de crear nuevas tarjetas con los valores iniciales 
*en CERO y de gestionar la funcion de repaso, conectando a la
*base de datos en el algoritmo SM-2
==============================================================
*/

const supabase = require('../services/supabaseClient');

//importamos el algoritmo
const {calcularSM2} = require ('../utils/sm2');

//funcion flashcard nueva
const crearFlashcard= async(req, res) =>{
    try{
        //saca los datos basicos que el user manda desde frontend
        const{mazo_id, pregunta, respuesta} = req.body;

        //calculala fecha de hoy para la nueva revision
        const fechaHoy = new Date().toISOString().split('T')[0];

        //manda todo a la tabla flashcards de DB
        const{data, error} = await supabase
        .from('flashcards')
        .insert([{
            mazo_id: mazo_id,
            pregunta: pregunta,
            respuesta: respuesta,
            //valores iniciales para SM2
            repeticiones:0,
            intervalo_dias:0,
            factor_facilidad:2.5,
            prox_revision:fechaHoy
        }])
        .select();

        if(error) throw error;

        //mensaje de exito
        res.status(201).json({
            status: 201,
            mensaje: "Flashcard creada y lista para estudiar. ",
            flashcard: data[0]
        });
    }catch(error){
        console.error("Error al crear la flashcard. ", error.message);
        res.status(500).json({error:error.message});
    }
};

//funcion repasar una flashcard
const repasarFlashcard = async(req, res) =>{
    try{
        const {id} = req.params;
        const {calidad} = req.body;

        //buscar tarjeta actual
        const{data: tarjetaVieja, error: errorBusqueda} = await supabase
        .from('flashcards')
        .select('repeticiones, intervalo_dias, factor_facilidad')
        .eq('flashcard_id', id)
        .single();

        if(errorBusqueda) throw errorBusqueda;

        //calcula los nuevos valores con SM-2
        const nuevosValores = calcularSM2(
            calidad,
            tarjetaVieja.repeticiones,
            tarjetaVieja.intervalo_dias,
            tarjetaVieja.factor_facilidad
        );

        //calcula la nueva fecha
        const fechaProxima = new Date();
        fechaProxima.setDate(fechaProxima.getDate() + nuevosValores.intervalo);
        const proximaRevisionString = fechaProxima.toISOString().split('T')[0];

        //guarda la actualizacion
        const {data: tarjetaActualizada, error: errorActualizacion} = await supabase
        .from('flashcards')
        .update({
            repeticiones: nuevosValores.repeticiones,
            intervalo_dias: nuevosValores.intervalo,
            factor_facilidad: nuevosValores.factorFacilidad,
            prox_revision: proximaRevisionString
        })
        .eq('flashcard_id', id)
        .select();

        if(errorActualizacion) throw errorActualizacion;

        res.status(200).json({
            status: 200,
            mensaje: "Repaso guardado.",
            flashcard: tarjetaActualizada[0]
        });
    } catch(error){
        console.error("Error al repasar flashcard. ", error.message);
        res.status(500).json({error: error.message});
    }
};

//funcion Obtener tarjetas para repasar hoy
const obtenerTarjetasParaRepasar = async(req, res) => {
    try{
        const {mazo_id} = req.params;
        const fechaHoy = new Date().toISOString().split('T')[0];

        const {data, error} = await supabase
        .from('flashcards')
        .select('*')
        .eq('mazo_id', mazo_id)
        .lte('prox_revision', fechaHoy)

    if (error) throw error;

    res.status(200).json({
        status: 200,
        mensaje: data.length > 0 ? `Tienes ${data.length} tarjetas pendientes` : `Estas al dia`,
        flashcards: data
    });

    } catch(error){
        console.error("Error al obtener tarjetas: ", error.message);
        res.status(500).json({error: error.message});
    }
};

module.exports = {crearFlashcard, repasarFlashcard, obtenerTarjetasParaRepasar};