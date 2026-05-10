/*
====================================================================
*Archivo: flashcardRoutes.js
*Descripción: Define los endpoints para interactuar con las tarjetas
*Conecta la creacion de tarjetas (POST) y la actualizacion / repaso
*(PUT) con las funciones del flashcardController
=====================================================================
*/

const express = require('express');
const router = express.Router();
const verificarTokenSupabase = require('../middlewares/authMiddleware');
//const{crearFlashcard, repasarFlashcard, obtenerTarjetasParaRepasar} = require('../controllers/flashcardController');
// Importamos TODAS las funciones del controlador
const {
    crearFlashcard, 
    repasarFlashcard, 
    obtenerTarjetasParaRepasar,
    obtenerTodasLasFlashcards,
    editarFlashcard,
    eliminarFlashcard
} = require('../controllers/flashcardController');

//puerta POST para crear la tarjeta
router.post('/',verificarTokenSupabase, crearFlashcard);

//Puerta PUT para repasar / actualizar una tarjeta existente
router.put('/:id/repasar', verificarTokenSupabase, repasarFlashcard);

//Puerta GET para pedir las tarjetas que tocan estudiar hoy de un mazo especifico
router.get('/estudiar/:mazo_id', verificarTokenSupabase, obtenerTarjetasParaRepasar);

// ==========================================
// NUEVAS RUTAS DE ADMINISTRACIÓN
// ==========================================

// Puerta GET para ver la lista completa de tarjetas de un mazo
router.get('/mazo/:mazo_id', verificarTokenSupabase, obtenerTodasLasFlashcards);

// Puerta PUT para editar el texto de una tarjeta
router.put('/:id', verificarTokenSupabase, editarFlashcard);

// Puerta DELETE para borrar una tarjeta
router.delete('/:id', verificarTokenSupabase, eliminarFlashcard);


//exportar funcion
module.exports = router;