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

    //retardo que va a haber entre cuadro y cuadro
    const retardo = 10;

    //para pasar de [px] a [m], o de [ms] a [s] en el sistema solar interno
    const factorDistanciaInterno = 1.8991667;    //1 [px], cuando es sistema interno, es 18,9916667 millones de [km] de la vida real
    const factorTiempoInterno = 0.1217667;    //1 [ms], cuando es sistema interno, es 0,1217667 [dias] de la vida real
    const Ginterna = 2.157;    //[([px]^3)/([masaSolar]*([ms]^2))]

    //para pasar de [px] a [m], o de [ms] a [s] en el sistema solar externo
    const factorDistanciaExterno = 37.5358333;  //1 [px], cuando es sistema externo, es 37,5358333 millones de [km] de la vida real
    const factorTiempoExterno = 10.227;   //1 [ms], cuando es sistema externo, es 10,227 [dias] de la vida real
    const Gexterna = 1.97;    //[([px]^3)/([masaSolar]*([ms]^2))]

    //valores orbitales de los planetas, expresados en unidades sobre las que la funcion dibujarSistema() puede operar directamnete, para cargarlas en un input, deben obtenerse los valores reales usando los dos bloques de constants anteriores
    const periodoOrbitalOriginal = [723, 1845, 3000, 5642, 424, 1053, 3000, 5886];    //[ms]
    const velocidadOrbitalOriginal = [0.261, 0.194, 0.161, 0.134, 0.311, 0.227, 0.159, 0.128];     //[[px]/[ms]] calculados a partir de velocidadOrbital = 2 * pi * distanciaAlSol / periodoOrbital
    const distanciaAlSolOriginal = [30, 57, 77, 120, 21, 38, 76, 120];    //[px]

    //radio de los planetas expresados en [px] para que sean aproximadamente proporcional a sus radios reales
    const radioDelPlanetaPixeles = [3, 4, 5, 4, 5, 4, 3, 3]; //[px]

    //otras constatnes, que son imprimidas en los inputs directamente, el usuario no opera sobre ellos ni sobre una copia de ellos
    const nombreDelPlaneta = ["MERCURIO", "VENUS", "TIERRA", "MARTE", "JUPITER", "SATURNO", "URANO", "NEPTUNO"];
    const colorDelPlaneta = ["#b76146", "#f5da5b", "#88eed5", "#e74413", "#ff997f", "#ffe488", "#0759ff", "#e3fffd"];
    const masaDelPlaneta = ["3,59 x 10 ^ 23 kg", "4,9 x 10 ^ 24 kg", "5,98 x 10 ^ 24 kg", "6,58 x 10 ^ 23 kg", "1,9 x 10 ^ 27 kg", "5,69 x 10 ^ 26 kg", "8,73 x 10 ^ 25 kg", "1,03 x 10 ^ 26 kg"];
    const radioDelPlaneta = ["4,9 x 10 ^6 km", "12,1 x 10 ^6 km", "12,8 x 10 ^6 km", "6,8 x 10 ^6 km", "143 x 10 ^6 km", "108,7 x 10 ^6 km", "51,1 x 10 ^6 km", "49,5 x 10 ^6 km"];
    const temperaturaMedia = ["166,85 °C", "456,85 °C", "14,85 °C", "-46,15 °C", "-121,15 °C", "-139,15 °C", "-197,15 °C", "-220,15 °C"];

    //parametros del sol
    const radioSol = 10;
    const colorSol = "#ffdb05";


    //-------------------------------------------------------------------------VARIABLES-------------------------------------------------------------------------//

    //se carga el planeta elegido por el ussuario en la pagina index
    let planeta = parseInt(window.location.hash.split('#')[1]);

    //sirve para saber si es el sistema solar externo o interno. Su valor es la posicion del primer planeta en el nivel elegido (interno o externo) del sistema solar
    let planetaInicial;

    //se cargan en estas variables la informacion para lograr el correcto pasaje de unidades. Depende de si se esta en el sistema solar interno o externo
    let factorTiempo;
    let factorDistancia;

    //se cargan las coordenadas del origen del sistema solar con respecto a la pagina
    let origenX;
    let origenY;

    //se declara variable radio, que es la distancia que hay dede el origen del sistema solar hasta donde esta el cursor
    let radio = 300;

    //se crean variables locales de las variables que el usuario puede cambiar para poder restaurarlas a sus valores originales
    let periodoOrbital = periodoOrbitalOriginal;
    let velocidadOrbital = velocidadOrbitalOriginal;
    let distanciaAlSol = distanciaAlSolOriginal;

    //se declaran variables auxiliares para almacenar el angulo recorrido por un planeta, el ancho de la orbita de un planeta cuando el cursor (cambia cuando el cursor esta sobre la orbita) y si hay que aumentar el tamaño del sol
    let anguloPlaneta = [0, 0, 0, 0, 0, 0, 0, 0];
    let anchoLineaOrbita = [1, 1, 1, 1, 1, 1, 1, 1];
    let aumentarSol = false;

    //se declara el indice que se va a usar como contador en todos los ciclos for
    let i;

    //se guarda false si la funcion dibujarSistema() fue llamada por lo menos una vez, si no es true
    let primero = true;


    //-------------------------------------------------------------------------EVENTOS-------------------------------------------------------------------------//

    //se llama a seleccionar planeta cuando se hace click
    document.addEventListener("mousedown", seleccionarPlaneta, false);

    //se llama a actualizar radio cuando se mueve el cursor
    document.addEventListener("mousemove", actualizarRadio, false);


    //-------------------------------------------------------------------------FUNCIONES-------------------------------------------------------------------------//

    //
    function dibujarSistema() {
        origenX = canvas.offsetLeft + canvas.offsetWidth / 2;
        origenY = canvas.offsetTop + canvas.offsetHeight / 2;
        if (!(planeta >= 0 && planeta <= 9)) {
            planeta = 8;
            window.location.assign('simulador.html#8');
        }
        if ((planeta >= 4 && planeta <= 7) || planeta === 9) {
            planetaInicial = 4; //jupiter
            factorDistancia = factorDistanciaExterno;
            factorTiempo = factorTiempoExterno;
        }
        if ((planeta >= 0 && planeta <= 3) || planeta === 8) {
            planetaInicial = 0; //mercurio
            factorDistancia = factorDistanciaInterno;
            factorTiempo = factorTiempoInterno;
        }
        if (planeta === 8) {
            namePlanet[0].innerHTML = '<p style="font-size: 20px; margin-bottom: 2px;">SISTEMA SOLAR INTERNO</p>';
        }
        if (planeta === 9) {
            namePlanet[0].innerHTML = '<p style="font-size: 20px; margin-bottom: 2px;">SISTEMA SOLAR EXTERNO</p>';
        }
        for (i = 0; i < 4; i++) {
            anchoLineaOrbita[planetaInicial + i] = 1;
        }
        for (i = 0; i < 4; i++) {
            if ((planetaInicial + i) === planeta) {
                anchoLineaOrbita[planetaInicial + i] = 3;
                namePlanet[0].innerHTML = '<p style="font-size: 20px; margin-bottom: 2px;">' + nombreDelPlaneta[planetaInicial + i] + '</p>';
                i = 5;
            }
        }
        if (radio < radioSol + 5) {
            namePlanet[0].innerHTML = '<p style="font-size: 20px; margin-bottom: 2px;">SOL</p>';
            aumentarSol = true;
            i = 5;
        } else {
            for (i = 0; i < 4; i++) {

                if ((radio < (distanciaAlSol[planetaInicial + i] + 5) && radio > (distanciaAlSol[planetaInicial + i] - 5))) {
                    anchoLineaOrbita[planetaInicial + i] = 3;
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
            ctx.arc(150, 150, distanciaAlSol[planetaInicial + i], 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.arc(150 + distanciaAlSol[planetaInicial + i] * Math.cos(anguloPlaneta[planetaInicial + i]), 150 + distanciaAlSol[planetaInicial + i] * Math.sin(anguloPlaneta[planetaInicial + i]), radioDelPlanetaPixeles[planetaInicial + i] + (anchoLineaOrbita[planetaInicial + i] - 1) * 2, 0, Math.PI * 2, true);
            anguloPlaneta[planetaInicial + i] += multiplicadorVelocidad * (retardo) / (periodoOrbital[planetaInicial + i] / (2 * Math.PI));   //  (milisegundos que demora en refrezcarse el simulador) / (milisegundos que demora el planeta i en hacer un radian)
            ctx.fillStyle = colorDelPlaneta[planetaInicial + i];
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.arc(150, 150, radioSol + aumentarSol * 4, 0, Math.PI * 2, true);
        ctx.fillStyle = colorSol;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        aumentarSol = false;
    }

    function seleccionarPlaneta() {
        for (i = 0; i < 4; i++) {
            if (radio < (distanciaAlSol[planetaInicial + i] + 5) && radio > (distanciaAlSol[planetaInicial + i] - 5)) {
                planeta = planetaInicial + i;
                i = 5;
            }
        }
        if (i === 4 && !primero) {
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
            inputPeriodoOrbital.value = (periodoOrbital[planeta] * factorTiempo).toFixed(2) + " dias";
            inputVelocidadOrbital.value = (velocidadOrbital[planeta] * factorDistancia / factorTiempo).toFixed(2) + " millones de km por dia";
            inputDistanciaSol.value = (distanciaAlSol[planeta] * factorDistancia).toFixed(2) + " millones de km";
            inputRadioPlaneta.value = radioDelPlaneta[planeta];
            inputMasaPlaneta.value = masaDelPlaneta[planeta];
            inputTempMedia.value = temperaturaMedia[planeta];
        }
    }

    function actualizarRadio(mousePosicion) {
        radio = Math.sqrt((mousePosicion.clientX - origenX) * (mousePosicion.clientX - origenX) + (mousePosicion.clientY - origenY) * (mousePosicion.clientY - origenY));
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
    if(multiplicadorVelocidad / 1.62){  //para que nunca llegue a 0
        multiplicadorVelocidad /= 1.62;
    }
}

function aumentarVelocidad() {
    multiplicadorVelocidad *= 1.62;
}
