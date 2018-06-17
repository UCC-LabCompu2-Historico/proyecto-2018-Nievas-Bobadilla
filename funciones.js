let multiplicadorVelocidad = 1;

function cargarValor() {
    window.location.assign('simulador.html#' + document.getElementById("selectPlaneta").value);
}

function activarCanvas() {


    //-------------------------------------------------------------------------CONSTANTES-------------------------------------------------------------------------//

    //carga en constanes de todos los elementos del HTML utilizados en esta funcion
    const namePlanet = document.getElementsByClassName("namePlanet");
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

    //valores orbitales de los planetas, expresados en unidades sobre las que la funcion dibujarSistema() puede operar directamnete
    const periodoOrbitalMilisegundos = [2169, 5535, 9000, 16926, 1272, 3159, 9000, 17658];
    const distanciaAlSolPixeles = [32.5, 61.75, 83.42, 130, 23, 41.17, 82.33, 130];
    const radioDelPlanetaPixeles = [3, 4, 5, 4, 5, 4, 3, 3];

    //otras constatnes, que son imprimidas en los inputs directamente, el usuario no opera sobre ellos ni sobre una copia de ellos
    const nombreDelPlaneta = ["MERCURIO", "VENUS", "TIERRA", "MARTE", "JUPITER", "SATURNO", "URANO", "NEPTUNO"];
    const periodoOrbital = ["88 dias", "224,7 dias", "365,25 dias", "687 dias", "4332 dias", "10775 dias", "30681 dias", "60193 dias"];
    const velocidadOrbital = ["4,14 millones de km por dia", "3,02 millones de km por dia", "2,57 millones de km por dia", "2,08 millones de km por dia", "1132 miles de km por dia", "829 miles de km por dia", "588 miles de km por dia", "467 miles de km por dia"];
    const distanciaAlSol = ["57,9 millones de km", "108,2 millones de km", "146,6 millones de km", "227,9 millones de km", "778,3 millones de km", "1429,4 millones de km", "2871 millones de km", "4504,3 millones de km"];
    const colorDelPlaneta = ["#b76146", "#f5da5b", "#88eed5", "#e74413", "#ff997f", "#ffe488", "#0759ff", "#e3fffd"];
    const masaDelPlaneta = ["3,59 x 10 ^ 23 kg", "4,9 x 10 ^ 24 kg", "5,98 x 10 ^ 24 kg", "6,58 x 10 ^ 23 kg", "1,9 x 10 ^ 27 kg", "5,69 x 10 ^ 26 kg", "8,73 x 10 ^ 25 kg", "1,03 x 10 ^ 26 kg"];
    const radioDelPlaneta = ["4,9 x 10 ^6 km", "12,1 x 10 ^6 km", "12,8 x 10 ^6 km", "6,8 x 10 ^6 km", "143 x 10 ^6 km", "108,7 x 10 ^6 km", "51,1 x 10 ^6 km", "49,5 x 10 ^6 km"];
    const temperaturaMedia = ["166,85 °C", "456,85 °C", "14,85 °C", "-46,15 °C", "-121,15 °C", "-139,15 °C", "-197,15 °C", "-220,15 °C"];

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
    let radio = 150;

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

    //funcion principal, para dibujar sobre el canvas el sistema solar en el nivel elegido, tambien se encarga de mostrar arriba del canvas el planeta sobre el que esta el cursor
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
            namePlanet[0].innerHTML = '<p style="font-size: 20px; margin-bottom: 2px;">SISTEMA SOLAR INTERNO</p>';
        }
        if (planeta === 9) {
            namePlanet[0].innerHTML = '<p style="font-size: 20px; margin-bottom: 2px;">SISTEMA SOLAR EXTERNO</p>';
        }
        for (i = 0; i < 4; i++) {
            anchoLineaOrbita[planetaInicial + i] = anchoMinimo;
        }
        for (i = 0; i < 4; i++) {
            if ((planetaInicial + i) === planeta) {
                anchoLineaOrbita[planetaInicial + i] = anchoMaximo;
                namePlanet[0].innerHTML = '<p style="font-size: 20px; margin-bottom: 2px;">' + nombreDelPlaneta[planetaInicial + i] + '</p>';
                i = 5;
            }
        }
        if (radio < radioSol + 5) {
            namePlanet[0].innerHTML = '<p style="font-size: 20px; margin-bottom: 2px;">SOL</p>';
            aumentarSol = true;
        } else {
            aumentarSol = false;
            for (i = 0; i < 4; i++) {
                if ((radio < (distanciaAlSolPixeles[planetaInicial + i] + tolerancia) && radio > (distanciaAlSolPixeles[planetaInicial + i] - tolerancia))) {
                    anchoLineaOrbita[planetaInicial + i] = anchoMaximo;
                    namePlanet[0].innerHTML = '<p style="font-size: 20px; margin-bottom: 2px;">' + nombreDelPlaneta[planetaInicial + i] + '</p>';
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
            ctx.arc(origenXRelativo, origenYRelativo, distanciaAlSolPixeles[planetaInicial + i], 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.lineWidth = anchoMinimo;
            ctx.arc(origenXRelativo + distanciaAlSolPixeles[planetaInicial + i] * Math.cos(anguloPlaneta[planetaInicial + i]), origenYRelativo + distanciaAlSolPixeles[planetaInicial + i] * Math.sin(anguloPlaneta[planetaInicial + i]), radioDelPlanetaPixeles[planetaInicial + i] + (anchoLineaOrbita[planetaInicial + i] - 1) * 2, 0, Math.PI * 2, true);
            anguloPlaneta[planetaInicial + i] += multiplicadorVelocidad * (retardo) / (periodoOrbitalMilisegundos[planetaInicial + i] / (2 * Math.PI));   //  (milisegundos que demora en refrezcarse el simulador) / (milisegundos que demora el planeta i en hacer un radian)
            ctx.fillStyle = colorDelPlaneta[planetaInicial + i];
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

    //se activa cada vez que el usuario hace click. Si hace clik sobre un planeta, carga todos sus datos en los divs de las propiedades de los planetas, y cambia la variable planeta al elegido por el usuario
    function seleccionarPlaneta() {
        for (i = 0; i < 4; i++) {
            if (radio < (distanciaAlSolPixeles[planetaInicial + i] + tolerancia) && radio > (distanciaAlSolPixeles[planetaInicial + i] - tolerancia)) {
                planeta = planetaInicial + i;
                i = 5;
            }
        }
        if (i === 4 && !primero && radio < 150) {
            if (planetaInicial === 4) {
                planeta = 9;
            }
            if (planetaInicial === 0) {
                planeta = 8;
            }
            namePlanet[1].innerHTML = '';
            inputPeriodoOrbital.value = '';
            inputVelocidadOrbital.value = '';
            inputDistanciaSol.value = '';
            inputRadioPlaneta.value = '';
            inputMasaPlaneta.value = '';
            inputTempMedia.value = '';
        }
        if (planeta !== 8 && planeta !== 9) {
            namePlanet[1].innerHTML = '<p style="font-size: 20px; margin-bottom: 2px;">' + nombreDelPlaneta[planeta] + '</p>';
            inputPeriodoOrbital.value = periodoOrbital[planeta];
            inputVelocidadOrbital.value = velocidadOrbital[planeta];
            inputDistanciaSol.value = distanciaAlSol[planeta];
            inputRadioPlaneta.value = radioDelPlaneta[planeta];
            inputMasaPlaneta.value = masaDelPlaneta[planeta];
            inputTempMedia.value = temperaturaMedia[planeta];
        }
    }

    //se activa cada vez que el usuario mueve el cursor. Actualiza la varaible radio con la distancia que hay desde el centro del sistema solar hasta la posicion del cursor
    function actualizarRadio(mousePosicion) {
        radio = Math.sqrt((mousePosicion.clientX - origenXAbsoluto) * (mousePosicion.clientX - origenXAbsoluto) + (mousePosicion.clientY - origenYAbsoluto) * (mousePosicion.clientY - origenYAbsoluto));
    }


    //-------------------------------------------------------------------------INTERVALO-------------------------------------------------------------------------//

    //se llama a la funcion dibujarSistema() cada un tiempo equivalente a la constante retardo
    setInterval(dibujarSistema, retardo);
}

function cambiarNivelInterno() {
    window.location.assign('simulador.html#8');
    location.reload();
}

function cambiarNivelExterno() {
    window.location.assign('simulador.html#9');
    location.reload();
}

function disminuirVelocidad() {
    if (multiplicadorVelocidad / 1.62) {  //para que nunca llegue a 0
        multiplicadorVelocidad /= 1.62;
    }
}

function aumentarVelocidad() {
    multiplicadorVelocidad *= 1.62;
}
