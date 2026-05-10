/*
============================================================
Archivo: recursosRoutes.js
Descripcion: Define los endpoints par subir archivos a los mazos
=================================================================
*/

const express = require('express');
const router =  express.Router();
const upload = require('../middlewares/uploadMiddleware');
const verificarTokenSupabase = require('../middlewares/authMiddleware');

const {agregarRecursoAMazo, obtenerRecursosPorMazo, eliminarRecurso} = require('../controllers/recursoController');

//Puerta POST
router.post('/:mazo_id', verificarTokenSupabase, upload.single('archivo_adjunto'), agregarRecursoAMazo);

//Puerta GET
router.get('/:mazo_id', verificarTokenSupabase, obtenerRecursosPorMazo);

//Puerta DELETE
router.delete('/:recurso_id', verificarTokenSupabase, eliminarRecurso);

module.exports = router;