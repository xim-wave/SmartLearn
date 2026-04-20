/*
=============================================================
*Archivo: mazoRoutes.js
*Descripción: Define los endpoints para la gestion de mazos
*Conecta las peticiones HTTP(GET, POST) en la ruta /api/mazos
*con las funciones del mazoController
==============================================================
*/

//importamos Express para manejar las direcciones web
const express = require('express');

//router dedicado a organizar las rutas de los mazos
const router = express.Router();

//importamos la funcion crearMazo de controllers
const { crearMazo, obtenerMazos, editarMazo, eliminarMazo } = require('../controllers/mazoController');

//cuando alguien haga una peticion POST, se ejecute crearMazo
router.post('/', crearMazo);

//Puerta GET: para leer los mazos existentes en las tablas
router.get('/', obtenerMazos);

//Puerta PUT para editar un mazo
router.put('/:id', editarMazo);

//Puerta DELETE para borrar un mazo
router.delete('/:id', eliminarMazo);

//exportamos el Router para que el principal (server.js) lo use
module.exports = router;