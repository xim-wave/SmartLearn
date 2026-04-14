/*
============================================================================
*Archivo: server.js
*Descripción: Archivo principal y punto de entrada del Backend de SmartLearn
*Se encargad e inicializar el servidor Express, configurar los
*middlewares de seguridad (CORS) y conectar todas las rutas
*(API endpoints) de la aplicacion
*Autor: David Mtz
============================================================================
*/

const express = require('express');
const cors = require('cors');

//Cliente de supabase
const supabase = require('./services/supabaseClient');

const app = express();

app.use(cors());
app.use(express.json());

//Ruta Base
app.get('/',(req, res) => {
    res.json({
        status: 200, message: "Servidor SmartLearn en línea c: "
    });
});

//ruta para conectar con supabase
app.get('/api/test-db', async(req, res) => {
    try{
        const {data, error} = await supabase.from('mazos').select('*');
        //aviso de error
        if(error) throw error;

        //respuesta si no hay error
        res.json({
            status: 200,
            mensaje: "Conexion a Supabase Exitosa",
            usuarios: data
        });
    } catch (error){
        console.error("Error en la DB: ", error.message);
        res.status(500).json({error: error.message});
    }
});

//Rutas para acceder a la tabla de mazos en supabase
const mazoRoutes = require('./routes/mazoRoutes');
app.use('/api/mazos', mazoRoutes);


//importar y conectar las rutas de autenticacion
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

//ruta de flashcards
const flashcardRoutes = require('./routes/flashcardRoutes');
app.use('/api/flashcards',flashcardRoutes);

//puerto del .env o del 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});