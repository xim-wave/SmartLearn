/*
===================================================================
*Archivo: authController.js
*Descripción: Controlador encargado de la autenticación de usuarios
*Maneja la lógica para registrar nuevos usuarios e iniciar sesion
*comunicandose directamente con Supabase Auth 
*Y gestiona la entrega de Tokens de acceso
====================================================================
*/

//conexion a base de datos
const supabase = require('../services/supabaseClient');

//funcion registrar Usuario
const registrarUsuario = async(req, res) => {
    try {
        const {email, password} = req.body;

        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        
        //alerta de error si hay alguno en la contraseña
        if (error) throw error;

        //mensaje de confirmacion
        res.status(201).json({
            status: 201,
            mensaje: "Usuario registrado con exito. ",
            usuario: data.user
        });

    } catch (error){
        console.error("Error al registrar: ", error.message);
        res.status(400).json({error: error.message});
    }
};

//funcion iniciar sesion
const iniciarSesion = async (req, res) =>{
    try{
        //pedir correo y contraseña
        const{email, password} = req.body;

        //comprobamos si en supabase las credenciales son correctas
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        //si el usuario no existe o si la contra esta mal, muestra mensaje de error
        if(error) throw error;

        //mensaje de exito
        res.status(200).json({
            status:200,
            mensaje: "Bienvenido de vuelta :)",
            usuario: data.user,
            token: data.session.access_token
        });
    } catch(error){
        console.error("Error al iniciar sesion: ", error.message); 
        //status 401 (no autorizado/credenciales invalidas)
        res.status(401).json({error: error.message});
    }
};

//exportar funcion
module.exports = {registrarUsuario, iniciarSesion};