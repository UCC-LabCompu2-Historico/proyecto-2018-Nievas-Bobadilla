let multiplicadorVelocidad = 1;

function cargarValor() {
    window.location.assign('simulador.html#' + document.getElementById("selectPlaneta").value);
}

/**
 * Encargado de todas las funcionalidades del canvas y los inputs, que se refrescan cada 10 ms, absorbiendo los eventos mousedown y mousemove para darle interaccion con el usuario al simulador
 * @method activarCanvas
 */
function activarCanvas() {


    //-------------------------------------------------------------------------CONSTANTES-------------------------------------------------------------------------//

    //carga de todos los elementos del HTML utilizados en esta funcion
    const planetaSeleccionadoSuperior = document.getElementsByClassName("planetaSeleccionado")[0];
    const planetaSeleccionadoInferior = document.getElementsByClassName("planetaSeleccionado")[1];
    const inputPeriodoOrbital = document.getElementById("inputPeriodoOrbital");
    const inputVelocidadOrbital = document.getElementById("inputVelocidadOrbital");
    const inputDistanciaSol = document.getElementById("inputDistanciaSol");
    const inputMasaPlaneta = document.getElementById("inputMasaPlaneta");
    const inputRadioPlaneta = document.getElementById("inputRadioPlaneta");
    const inputTempMedia = document.getElementById("inputTempMedia");
    const canvas = document.getElementById("canvas");

    //carga del contexto del canvas
    const ctx = canvas.getContext("2d");

    //retardo que va a haber entre cuadro y cuadro, en milisegundos
    const retardo = 10;

    //informacion de cada planeta, util para su graficacion y para mostrar datos en los inputs
    const parametrosPlanetarios = [
        {
            nombreDelPlaneta: "MERCURIO",
            periodoOrbital: "88 dias",
            velocidadOrbital: "4,14 millones de km por dia",
            distanciaAlSol: "57,9 millones de km",
            colorDelPlaneta: "#b76146",
            masaDelPlaneta: "3,59 x 10 ^ 23 kg",
            radioDelPlaneta: "4,9 x 10 ^ 6 km",
            temperaturaMedia: "166,85 °C",
            periodoOrbitalMilisegundos: 2169,
            distanciaAlSolPixeles: 32,
            radioDelPlanetaPixeles: 3,
        },
        {
            nombreDelPlaneta: "VENUS",
            periodoOrbital: "224,7 dias",
            velocidadOrbital: "3,02 millones de km por dia",
            distanciaAlSol: "108,2 millones de km",
            colorDelPlaneta: "#f5da5b",
            masaDelPlaneta: "4,9 x 10 ^ 24 kg",
            radioDelPlaneta: "12,1 x 10 ^ 6 km",
            temperaturaMedia: "456,85 °C",
            periodoOrbitalMilisegundos: 5535,
            distanciaAlSolPixeles: 62,
            radioDelPlanetaPixeles: 4,
        },
        {
            nombreDelPlaneta: "TIERRA",
            periodoOrbital: "365,25 dias",
            velocidadOrbital: "2,57 millones de km por dia",
            distanciaAlSol: "146,6 millones de km",
            colorDelPlaneta: "#88eed5",
            masaDelPlaneta: "5,98 x 10 ^ 24 kg",
            radioDelPlaneta: "12,8 x 10 ^ 6 km",
            temperaturaMedia: "14,85 °C",
            periodoOrbitalMilisegundos: 9000,
            distanciaAlSolPixeles: 83,
            radioDelPlanetaPixeles: 5,
        },
        {
            nombreDelPlaneta: "MARTE",
            periodoOrbital: "687 dias",
            velocidadOrbital: "2,08 millones de km por dia",
            distanciaAlSol: "227,9 millones de km",
            colorDelPlaneta: "#e74413",
            masaDelPlaneta: "6,58 x 10 ^ 23 kg",
            radioDelPlaneta: "6,8 x 10 ^ 6 km",
            temperaturaMedia: "-46,15 °C",
            periodoOrbitalMilisegundos: 16926,
            distanciaAlSolPixeles: 130,
            radioDelPlanetaPixeles: 4,
        },
        {
            nombreDelPlaneta: "JUPITER",
            periodoOrbital: "4332 dias",
            velocidadOrbital: "1132 miles de km por dia",
            distanciaAlSol: "778,3 millones de km",
            colorDelPlaneta: "#ff997f",
            masaDelPlaneta: "1,9 x 10 ^ 27 kg",
            radioDelPlaneta: "143 x 10 ^ 6 km",
            temperaturaMedia: "-121,15 °C",
            periodoOrbitalMilisegundos: 1272,
            distanciaAlSolPixeles: 23,
            radioDelPlanetaPixeles: 5,
        },
        {
            nombreDelPlaneta: "SATURNO",
            periodoOrbital: "10775 dias",
            velocidadOrbital: "829 miles de km por dia",
            distanciaAlSol: "1429,4 millones de km",
            colorDelPlaneta: "#ffe488",
            masaDelPlaneta: "5,69 x 10 ^ 26 kg",
            radioDelPlaneta: "108,7 x 10 ^ 6 km",
            temperaturaMedia: "-139,15 °C",
            periodoOrbitalMilisegundos: 3159,
            distanciaAlSolPixeles: 41,
            radioDelPlanetaPixeles: 4,
        },
        {
            nombreDelPlaneta: "URANO",
            periodoOrbital: "30681 dias",
            velocidadOrbital: "588 miles de km por dia",
            distanciaAlSol: "2871 millones de km",
            colorDelPlaneta: "#0759ff",
            masaDelPlaneta: "8,73 x 10 ^ 25 kg",
            radioDelPlaneta: "51,1 x 10 ^6 km",
            temperaturaMedia: "-197,15 °C",
            periodoOrbitalMilisegundos: 9000,
            distanciaAlSolPixeles: 82,
            radioDelPlanetaPixeles: 3,
        },
        {
            nombreDelPlaneta: "NEPTUNO",
            periodoOrbital: "60193 dias",
            velocidadOrbital: "467 miles de km por dia",
            distanciaAlSol: "4504,3 millones de km",
            colorDelPlaneta: "#e3fffd",
            masaDelPlaneta: "1,03 x 10 ^ 26 kg",
            radioDelPlaneta: "49,5 x 10 ^ 6 km",
            temperaturaMedia: "-220,15 °C",
            periodoOrbitalMilisegundos: 17658,
            distanciaAlSolPixeles: 130,
            radioDelPlanetaPixeles: 3,
        },
    ];

    //parametros del sol
    const radioSol = 10;
    const colorSol = "#ffdb05";

    //parametros sobre el ancho de la linea
    const anchoMinimo = 1;
    const anchoMaximo = 2;

    //tolerancia para resaltar o seleccionar un planeta
    const tolerancia = 5;


    //-------------------------------------------------------------------------VARIABLES-------------------------------------------------------------------------//

    //se carga el planeta elegido por el ussuario en la pagina index
    let planeta = parseInt(window.location.hash.split('#')[1]);

    //sirve para saber si es el sistema solar externo o interno. Su valor es la posicion del primer planeta en el nivel elegido (interno o externo) del sistema solar
    let planetaInicial;

    //se cargan las coordenadas del origen del sistema solar con respecto a la pagina (absoluto) y con respecto al canvas (relativo)
    let origenXAbsoluto;
    let origenYAbsoluto;
    let origenXRelativo;
    let origenYRelativo;

    //se declara variable radio, que es la distancia que hay dede el origen del sistema solar hasta donde esta el cursor
    let radio = 200;

    //se declaran variables auxiliares para almacenar el angulo recorrido por un planeta, el ancho de la orbita de un planeta cuando el cursor (cambia cuando el cursor esta sobre la orbita) y si hay que aumentar el tamaño del sol
    let anguloPlaneta = [0, 0, 0, 0, 0, 0, 0, 0];
    let anchoLineaOrbita = [1, 1, 1, 1, 1, 1, 1, 1];
    let aumentarSol = false;

    //se declara el indice que se va a usar en todos los ciclos for
    let i;

    //se guarda false si la funcion dibujarSistema() fue llamada por lo menos una vez, si no, true
    let primero = true;


    //-------------------------------------------------------------------------EVENTOS-------------------------------------------------------------------------//

    //se llama a seleccionar planeta cuando se hace click
    document.addEventListener("mousedown", seleccionarPlaneta, false);

    //se llama a actualizar radio cuando se mueve el cursor
    document.addEventListener("mousemove", actualizarRadio, false);


    //-------------------------------------------------------------------------FUNCIONES-------------------------------------------------------------------------//

    /**
     * Actualiza las variables que indican la posicion del origen del sistema solar, imprime el planeta seleccionado, el planeta sobre el que se posa el cursor, y grafica todo el canvas
     * @method dibujarSistema
     */
    function dibujarSistema() {
        origenXRelativo = canvas.offsetWidth / 2;
        origenYRelativo = canvas.offsetHeight / 2;
        origenXAbsoluto = canvas.offsetLeft + origenXRelativo;
        origenYAbsoluto = canvas.offsetTop + origenYRelativo;
        /*
        Significado de los valores de la variable planeta

            planetas del sistema solar interno
            0: MERCURIO
            1: VENUS
            2: TIERRA
            3: MARTE

            planetas del sistema solar externo
            4: JUPITER
            5: SATURNO
            6: URANO
            7: NEPTUNO

            niveles del sistema solar
            8: SISTEMA SOLAR INTERNO
            9: SISTEMA SOLAR EXTERNO

            null: se asigna planeta = 8 (SISTEMA SOLAR INTERNO)
        */
        if (!(planeta >= 0 && planeta <= 9)) {
            planeta = 8;
            window.location.assign('simulador.html#8');
        }
        if ((planeta >= 4 && planeta <= 7) || planeta === 9) {
            planetaInicial = 4; //jupiter
        }
        if ((planeta >= 0 && planeta <= 3) || planeta === 8) {
            planetaInicial = 0; //mercurio
        }
        if (planeta === 8) {
            planetaSeleccionadoSuperior.innerHTML = '<p class="textoPlanetaSeleccionado">SISTEMA SOLAR INTERNO</p>';
        }
        if (planeta === 9) {
            planetaSeleccionadoSuperior.innerHTML = '<p class="textoPlanetaSeleccionado">SISTEMA SOLAR EXTERNO</p>';
        }
        for (i = 0; i < 4; i++) {
            anchoLineaOrbita[planetaInicial + i] = anchoMinimo;
        }
        for (i = 0; i < 4; i++) {
            if ((planetaInicial + i) === planeta) {
                anchoLineaOrbita[planetaInicial + i] = anchoMaximo;
                planetaSeleccionadoSuperior.innerHTML = '<p class="textoPlanetaSeleccionado">' + parametrosPlanetarios[planetaInicial + i].nombreDelPlaneta + '</p>';
                i = 5;
            }
        }
        if (radio < radioSol + 5) {
            planetaSeleccionadoSuperior.innerHTML = '<p class="textoPlanetaSeleccionado">SOL</p>';
            aumentarSol = true;
        } else {
            aumentarSol = false;
            for (i = 0; i < 4; i++) {
                if ((radio < (parametrosPlanetarios[planetaInicial + i].distanciaAlSolPixeles + tolerancia) && radio > (parametrosPlanetarios[planetaInicial + i].distanciaAlSolPixeles - tolerancia))) {
                    anchoLineaOrbita[planetaInicial + i] = anchoMaximo;
                    planetaSeleccionadoSuperior.innerHTML = '<p class="textoPlanetaSeleccionado">' + parametrosPlanetarios[planetaInicial + i].nombreDelPlaneta + '</p>';
                    i = 5;
                }
            }
        }
        if (primero) {
            if (planeta <= 7 && planeta >= 0)
                seleccionarPlaneta();
            primero = false;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.lineWidth = anchoLineaOrbita[planetaInicial + i];
            ctx.arc(origenXRelativo, origenYRelativo, parametrosPlanetarios[planetaInicial + i].distanciaAlSolPixeles, 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.lineWidth = anchoMinimo;
            ctx.arc(origenXRelativo + parametrosPlanetarios[planetaInicial + i].distanciaAlSolPixeles * Math.cos(anguloPlaneta[planetaInicial + i]), origenYRelativo + parametrosPlanetarios[planetaInicial + i].distanciaAlSolPixeles * Math.sin(anguloPlaneta[planetaInicial + i]), parametrosPlanetarios[planetaInicial + i].radioDelPlanetaPixeles + (anchoLineaOrbita[planetaInicial + i] - 1) * 2, 0, Math.PI * 2, true);
            anguloPlaneta[planetaInicial + i] += multiplicadorVelocidad * (retardo) / (parametrosPlanetarios[planetaInicial + i].periodoOrbitalMilisegundos / (2 * Math.PI));   //  (milisegundos que demora en refrezcarse el simulador) / (milisegundos que demora el planeta i en hacer un radian)
            ctx.fillStyle = parametrosPlanetarios[planetaInicial + i].colorDelPlaneta;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        ctx.beginPath();
        ctx.lineWidth = anchoMinimo;
        ctx.arc(origenXRelativo, origenYRelativo, radioSol + aumentarSol * 2 * anchoMaximo, 0, Math.PI * 2, true);
        ctx.fillStyle = colorSol;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Carga la variable planeta segun la variable radio y las distancias al sol de los planetas, y carga los inputs segun corresponda
     * @method seleccionarPlaneta
     */
    function seleccionarPlaneta() {
        for (i = 0; i < 4; i++) {
            if (radio < (parametrosPlanetarios[planetaInicial + i].distanciaAlSolPixeles + tolerancia) && radio > (parametrosPlanetarios[planetaInicial + i].distanciaAlSolPixeles - tolerancia)) {
                planeta = planetaInicial + i;
                i = 5;
            }
        }
        if (i === 4 && !primero && radio < 200) {
            if (planetaInicial === 4) {
                planeta = 9;
            }
            if (planetaInicial === 0) {
                planeta = 8;
            }
            planetaSeleccionadoInferior.innerHTML = '';
            inputPeriodoOrbital.value = '';
            inputVelocidadOrbital.value = '';
            inputDistanciaSol.value = '';
            inputRadioPlaneta.value = '';
            inputMasaPlaneta.value = '';
            inputTempMedia.value = '';
        }
        if (planeta !== 8 && planeta !== 9) {
            planetaSeleccionadoInferior.innerHTML = '<p class="textoPlanetaSeleccionado">' + parametrosPlanetarios[planeta].nombreDelPlaneta + '</p>';
            inputPeriodoOrbital.value = parametrosPlanetarios[planeta].periodoOrbital;
            inputVelocidadOrbital.value = parametrosPlanetarios[planeta].velocidadOrbital;
            inputDistanciaSol.value = parametrosPlanetarios[planeta].distanciaAlSol;
            inputRadioPlaneta.value = parametrosPlanetarios[planeta].radioDelPlaneta;
            inputMasaPlaneta.value = parametrosPlanetarios[planeta].masaDelPlaneta;
            inputTempMedia.value = parametrosPlanetarios[planeta].temperaturaMedia;
        }
        window.location.assign('simulador.html#' + planeta);
    }

    /**
     * Actualiza la variable radio segun la posicion del cursor con rspecto al origen del sistema solar
     * @method actualizarRadio
     * @param mousePosicion
     */
    function actualizarRadio(mousePosicion) {
        radio = Math.sqrt((mousePosicion.clientX - origenXAbsoluto) * (mousePosicion.clientX - origenXAbsoluto) + (mousePosicion.clientY - origenYAbsoluto) * (mousePosicion.clientY - origenYAbsoluto));
    }


    //-------------------------------------------------------------------------INTERVALO-------------------------------------------------------------------------//

    //se llama a la funcion dibujarSistema() cada un tiempo equivalente a la constante retardo
    setInterval(dibujarSistema, retardo);
}

/**
 * Se traslada al sistema solar interno asignando un 8 al final de la URL y actualizando la pagina
 * @method cambiarNivelInterno
 */
function cambiarNivelInterno() {
    window.location.assign('simulador.html#8');
    location.reload();
}

/**
 * Se traslada al sistema solar externo asignando un 9 al final de la URL y actualizando la pagina
 * @method cambiarNivelExterno
 */
function cambiarNivelExterno() {
    window.location.assign('simulador.html#9');
    location.reload();
}

/**
 * Disminuye la variable global multiplicadorDeVelocidad
 * @method disminuirVelocidad
 */
function disminuirVelocidad() {
    if (multiplicadorVelocidad / 1.62) {  //para que nunca llegue a 0
        multiplicadorVelocidad /= 1.62;
    }
}

/**
 * Aumenta la variable global multiplicadorDeVelocidad
 * @method aumentarVelocidad
 */
function aumentarVelocidad() {
    multiplicadorVelocidad *= 1.62;
}
