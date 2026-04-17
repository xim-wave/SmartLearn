/*
============================================================
Archivo: recursosRoutes.js
Descripcion: Define los endpoints par subir archivos a los mazos
=================================================================
*/

const express = require('express');
const router =  express.Router();
const upload = require('../middlewares/uploadMiddleware');
const {agregarRecursoAMazo} = require('../controllers/recursoController');

//Puerta POST
router.post('/:mazo_id', upload.single('archivo_adjunto'), agregarRecursoAMazo);

module.exports = router;