const calcularSM2 = (calidad, repeticiones, intervalo, factorFacilidad) =>{
    //validamos que la calidad sea un numero del 0 al 5
    //0=mente en blanco, 5= respuesta perfecta e inmediata
    if(calidad < 0 || calidad > 5){
       calidad = 0;
    }

    //si la respuesta fue correcta (3, 4, o 5)
    if(calidad >= 3){
        //si es la primera vez que la vio, se recuerda mañana
        if(repeticiones === 0){
            intervalo = 1;
        } else if(repeticiones === 1){
            //si es la 2da vez, se recuerda en 6 días
            intervalo=6;
        } else{
            //si acertó varias veces, se multiplica por el FF
            intervalo = Math.round(intervalo*factorFacilidad);
        }

        //suma acierto a su racha
        repeticiones++;
    }

    //si la respuesta fue incorrecta(0, 1, o 2)
    else{
        //se reinicia la racha y se muestra mañana
        repeticiones = 0;
        intervalo =1;
    }

    //actualiza el FF con la formula
    factorFacilidad = factorFacilidad + (0.1 - (5-calidad) * (0.08 + (5-calidad) * 0.02));

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