/*
=====================================================================================
*Archivo: supabaseClient.js (Directorio services)
*Descripción: Archivo de configuración para la conexion con la DB
*Inicializa y exporta el cliente oficial de Supabase usando las 
*credenciales de seguridad (URL / API Key) definidas en las variables de entorno(.env)
======================================================================================
*/

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Esta es la anon_key
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // La nueva llave maestra

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
    console.error("🚨 Faltan variables de entorno en el .env (URL, KEY o SERVICE_ROLE_KEY).");
}

// 1. Cliente normal (obedece las reglas RLS)
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Cliente Administrador (se salta las reglas RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Exportamos ambos como un objeto
module.exports = { 
    supabase, 
    supabaseAdmin 
};