/*
=======================================================
*Archivo: authRouters.js
*Descripción: Define los endpoints para la autenticacion
*conecta peticiones HTTP (/registro, /login) con sus 
*respectivas funciones en el authControler
=========================================================
*/

//importar Express y crear router
const express = require('express');
const router = express.Router();

const {registrarUsuario, iniciarSesion} = require('../controllers/authController');

router.post('/registro', registrarUsuario);

//POST para logear
router.post('/login', iniciarSesion);

module.exports = router;