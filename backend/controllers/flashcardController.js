const supabase = require('../services/supabaseClient');

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

module.exports = {crearFlashcard};