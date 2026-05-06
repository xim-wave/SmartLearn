/*
======================================================
*Archivo: sm2.js (Directorio Utils)
*Descripción: Contiene la lógica del algoritmo SM-2
*Calcula los intervalos de repetición espaciada
*y el factor de facilidad de cada tarjeta basándose en 
*la calidad de respuesta del usuario (0-5)
======================================================
*/
const calcularSM2 = (calidad, repeticiones, intervalo, factorFacilidad) =>{
    
    //validamos que la calidad sea un numero del 0 al 5
    //0=mente en blanco, 5= respuesta perfecta e inmediata
    if(calidad < 1 || calidad > 3){
       throw new Error("La calidad de la respuesta debe estar entre 1 y 3");
    }

    let calidadSM2;
    if(calidad ===1) calidadSM2 = 1;
    else if(calidad ===2) calidadSM2 = 4;
    else if(calidad ===3) calidadSM2 = 5;

    if(calidadSM2 >=3){
        //si es la primera vez que la ve, se recuerda mañana
        if(repeticiones===0){
            intervalo = 1;
        }else if(repeticiones ===1){
            //si es la 2da vez, se recuerda en 6 dias
            intervalo = 6;
        }else{
            intervalo = Math.round(intervalo*factorFacilidad);
        }
        repeticiones++;
    }
        
    //si la respuesta fue incorrecta(0, 1, o 2)
    else{
        //se reinicia la racha y se muestra mañana
        repeticiones = 0;
        intervalo =1;
    }

    //actualiza el FF con la formula
factorFacilidad = factorFacilidad + (0.1 - (5 - calidadSM2) * (0.08 + (5 - calidadSM2) * 0.02));
    //el factor no puede ser menor de 1.3
    if(factorFacilidad < 1.3){
        factorFacilidad = 1.3;
    }

    //devolvemos los 3 valores actualizados para que la DB lo guarde
    return{
        intervalo: intervalo,
        repeticiones: repeticiones,
        factorFacilidad: Math.round(factorFacilidad*100)/100
    };
};

//exportamos la funcion para que server la pueda usar
module.exports={calcularSM2};