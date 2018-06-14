function Cara(){
    // Toma el elemento canvas usando el DOM
    var canvas = document.getElementById('mycanvas');

        var ctx = canvas.getContext('2d');

        // Dibuja Lineas
        for (i=0;i<10;i++){
            ctx.lineWidth = 1+i;
            ctx.beginPath();
            ctx.moveTo(5+i*14,5);
            ctx.lineTo(5+i*14,140);
            ctx.stroke();
        }

}