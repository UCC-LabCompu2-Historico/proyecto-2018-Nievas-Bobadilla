function cargarValor(){
    var planeta = document.getElementById("selectPlaneta").value;
    var urlVar = 'simulador.html#' + planeta;
    window.location.assign(urlVar);
}

function descargarValor(){
    var planeta = window.location.hash.split('#')[1];
    console.log(planeta);
}

function Cara() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(150, 150, 10, 0, Math.PI*2, true);
    ctx.stroke();
    ctx.closePath();
}