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
const{crearFlashcard, repasarFlashcard, obtenerTarjetasParaRepasar} = require('../controllers/flashcardController');

//puerta POST para crear la tarjeta
router.post('/',crearFlashcard);

//Puerta PUT para repasar / actualizar una tarjeta existente
router.put('/:id/repasar',repasarFlashcard);

//Puerta GET para pedir las tarjetas que tocan estudiar hoy de un mazo especifico
router.get('/estudiar/:mazo_id', obtenerTarjetasParaRepasar);

//exportar funcion
module.exports = router;