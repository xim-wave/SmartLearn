/*
=============================================================
*Archivo: mazoController.js
*Descripción: Controlador para la gestión de Mazos de estudio
*Contiene las funciones para crear nuevos mazos
*y consultar los mazos existentes en la base de datos Supabase
==============================================================
*/


//importar la llave para comunicar con la base de datos
const supabase = require('../services/supabaseClient');

//funcion "crear mazo"
//"async" pq la base de datos está en internet y el codigo debe de "esperar"
const crearMazo = async(req, res) =>{
    try{
        //req es para que el front haga solicitudes
        //req.body es la "caja" de los datos del nuevo mazo
        const{titulo, descripcion, usuario_id} = req.body;


        //nos comunicamos con supabase para instertar una nueva fila en la tabla de mazos
        //y nos devuelve el mazo que acaba de guardar
        const {data, error} = await supabase
        .from('mazos')
        .insert([{nombre: titulo, descripcion:descripcion, usuario_id: usuario_id}])
        .select();

        //aviso de error en DB
        if(error) throw error;

        //respuesta del usuario que mandó los datos
        //201 significa que se creó con exito
        //y se manda un mensaje con los datos guardados del mazo
        res.status(201).json({
            status: 201,
            mensaje: "!Mazo creado con exito¡ ",
            mazo: data[0]
        });


        //mensaje de error de servidor
    } catch (error){
        console.error("Error al crear el mazo", error.message);
        res.status(500).json({error: error.message});
    }
};

//funcion para obtener todos los mazos
const obtenerMazos = async (req, res) => {
      try {
          const {data, error} = await supabase
              .from('mazos')
              .select('*');

            //si hay problema con la DB, volvemos al catch
          if (error) throw error;

          //mensaje de exito
         res.status(200).json({
             status: 200,
              mensaje: "Mazos recuperados. ",
             mazos: data
            });
       } catch (error){
          console.error("Error al obtener los mazos", error.message);
            res.status(500).json({error: error.message});
       }
};



//exportamos la funcion para que las rutas la puedan usar
module.exports = {crearMazo, obtenerMazos};