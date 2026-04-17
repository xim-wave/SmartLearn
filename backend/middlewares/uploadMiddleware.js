/*
=================================================================
*Archivo: uploadMiddleware.js
*Descripción: Middleware de seguridad para la gestion de archivos
*Configura Multer para validar que los archivos PDF/Imagenes
*No excedan los 10MB
==================================================================
*/

const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 10*1024*1024 //limite de los 10MB
    },
    fileFilter: (req, file, cb) =>{
        if(file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')){
            cb(null,true);
        } else{
            cb(new Error('Formato no valido. Solo se aceptan PDFs e imagenes.'));
        }
    }
});

module.exports = upload;