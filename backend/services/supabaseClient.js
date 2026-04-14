/*
=====================================================================================
*Archivo: supabaseClient.js (Directorio services)
*Descripción: Archivo de configuración para la conexion con la DB
*Inicializa y exporta el cliente oficial de Supabase usando las 
*credenciales de seguridad (URL / API Key) definidas en las variables de entorno(.env)
======================================================================================
*/

const {createClient} = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const  supabaseKey = process.env.SUPABASE_KEY;

if(!supabaseUrl || !supabaseKey){
    console.error("Faltan las variables de entorno del Supabase.");
}

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;