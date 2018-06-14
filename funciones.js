cargar
function Cara() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(150, 150, 50, 0, Math.PI*2, true);
    ctx.stroke();
}