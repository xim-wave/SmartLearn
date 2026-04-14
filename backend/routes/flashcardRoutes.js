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
const{crearFlashcard} = require('../controllers/flashcardController');

//puerta POST para crear la tarjeta
router.post('/',crearFlashcard);

//exportar funcion
module.exports = router;