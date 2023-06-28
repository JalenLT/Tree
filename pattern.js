//GET HTML ELEMENTS
var canvasPattern = document.getElementsByName("pattern_1")[0];
var ctxPattern = canvasPattern.getContext("2d");

function generateDotGradientPattern(canvas, ctx, division = 25, falloff = 0.5){
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var chunksX = Math.floor(canvasWidth / division);
    var chunksY = Math.floor(canvasHeight / division);
    for (let r = 0; r < chunksY; r++) {
        for (let i = 0; i < chunksX; i++) {
            var width = 0;
            if(i == 0){
                width = division;
            }else{
                let maxWidth = division / 2;
                let gradientChunks = Math.floor(chunksX * falloff);
            }
            ctx.beginPath();
            ctx.arc((division * (i + 1) - (division / 2)), (division * (r + 1) - (division / 2)), width / 2, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        }
    }
}

generateDotGradientPattern(canvasPattern, ctxPattern);