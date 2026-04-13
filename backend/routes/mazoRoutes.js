//importamos Express para manejar las direcciones web
const express = require('express');

//router dedicado a organizar las rutas de los mazos
const router = express.Router();

//importamos la funcion crearMazo de controllers
const{crearMazo, obtenerMazos} = require('../controllers/mazoController');

//cuando alguien haga una peticion POST, se ejecute crearMazo
router.post('/', crearMazo);

//Puerta GET: para leer los mazos existentes en las tablas
router.get('/', obtenerMazos);

//exportamos el Router para que el principal (server.js) lo use
module.exports = router;