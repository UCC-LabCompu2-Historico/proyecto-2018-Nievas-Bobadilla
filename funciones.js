let planeta = 10;    //por defecto fuera de rango

let factorDistanciaInterno = 1899166666;    //1 px, cuando es sistema interno, es 1899166666 metros de la vida real
let factorTiempoInterno = 10520;    //1 ms, cuando es sistema interno, es 10520 segundos de la vida real
let Ginterna = 2.157;    //[(px^3)/(mSolar)*(ms^2)]

let  FactorDistanciaExterno = 37535833333;  //1 px, cuando es sistema externo, es 37535833333 metros de la vida real
let FactorTiempoExterno = 883612;   //1 ms, cuando es sistema externo, es 883612 segundos de la vida real
let Gexterna = 1.97;    //[(px^3)/(mSolar)*(ms^2)]

let periodoOrbitalOriginal = [723, 1845, 3000, 5642, 424, 1053, 3000, 5886];    //[ms]
let velocidadOrbitalOriginal = [130, 194, 161, 134, 311, 227, 159, 128];     //[1000 * px/ms] calculados a partir de velocidadOrbital = 1000 * 2 * pi * distanciaAlSol / periodoOrbital
let distanciaAlSolOriginal = [15, 57, 77, 120, 21, 38, 76, 120];    //[px]

let radioDelPlanetaPixeles = [2, 4, 5, 4, 5, 4, 2, 2]; //[px]

let nombrePlaneta = ["Mercurio", "Venus", "Tierra", "Marte", "Jupiter", "Saturno", "Urano", "Neptuno"];
let masaDelPlaneta = ["3,59 x 10 ^ 23 kg", "4,9 x 10 ^ 24 kg", "5,98 x 10 ^ 24 kg", "6,58 x 10 ^ 23 kg", "1,9 x 10 ^ 27 kg", "5,69 x 10 ^ 26 kg", "8,73 x 10 ^ 25 kg", "1,03 x 10 ^ 26 kg"];
let radioDelPlaneta = ["4,9 x 10 ^6 km", "12,1 x 10 ^6 km", "12,8 x 10 ^6 km", "6,8 x 10 ^6 km", "143 x 10 ^6 km", "108,7 x 10 ^6 km", "51,1 x 10 ^6 km", "49,5 x 10 ^6 km"];
let temperaturaMedia = ["166,85 °C", "456,85 °C", "14,85 °C", "-46,15 °C", "-121,15 °C", "-139,15 °C", "-197,15 °C", "-220,15 °C"];

function cargarValor() {
    planeta = document.getElementById("selectPlaneta").value;
    let urlVar = 'simulador.html#' + planeta;
    window.location.assign(urlVar);
}

function descargarValor() {
    planeta = window.location.hash.split('#')[1];
}

function activarCanvas() {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    //se crean variables locales para que el usuario pueda cambiarlas, pudiendo restaurarlas a sus valores originales
    let periodoOrbital = periodoOrbitalOriginal;
    let velocidadOrbital = velocidadOrbitalOriginal;
    let distanciaAlSol = distanciaAlSolOriginal;

    let anguloPlaneta = [0, 0, 0, 0, 0, 0, 0, 0];

    dibujarSistema();
    //document.addEventListener("mousedown", dibujarSistema, false);

    function dibujarSistema() {
        let planetaInicial;
        if (planeta < 4) {
            planetaInicial = 0; //mercurio
        } else {
            planetaInicial = 4; //jupiter
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(150.8, 150, distanciaAlSol[planetaInicial + i], 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(150 + distanciaAlSol[planetaInicial + i] * Math.cos(anguloPlaneta[planetaInicial + i]), 150 + distanciaAlSol[planetaInicial + i] * Math.sin(anguloPlaneta[planetaInicial + i]), radioDelPlanetaPixeles[planetaInicial + i], 0, Math.PI * 2, true);
            anguloPlaneta[planetaInicial + i] += 20 / periodoOrbital[planetaInicial + i];
            ctx.fillStyle = "FFF";
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }

    setInterval(dibujarSistema, 20);    //50 fps
}