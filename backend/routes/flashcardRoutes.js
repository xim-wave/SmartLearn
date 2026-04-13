const express = require('express');
const router = express.Router();
const{crearFlashcard} = require('../controllers/flashcardController');

//puerta POST para crear la tarjeta
router.post('/',crearFlashcard);

//exportar funcion
module.exports = router;