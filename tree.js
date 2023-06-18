//GET HTML ELEMENTS
const canvas = document.getElementsByName("tree")[0];
const ctx = canvas.getContext("2d");
// ctx.lineCap = "round";
// ctx.lineJoin = "round";
var lineWidth = 20;
var mainLength = 100;
var mainAngle = 20;
var mainPoints = 30;
var treeNumbers = 10;

//FUNCTIONS
function refreshCanvas(){
    lineWidth = document.getElementsByName("tree_width")[0].value;
    mainPoints = document.getElementsByName("tree_point")[0].value;
    mainLength = document.getElementsByName("segment_length")[0].value;
    mainAngle = document.getElementsByName("segment_angle")[0].value;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pathPoints = [];
    ctx.beginPath();
    pathPoints.push(getBase(canvas));
    ctx.lineWidth = lineWidth;
    ctx.moveTo(pathPoints[0][0], pathPoints[0][1]);
    buildTree(canvas, mainPoints, mainAngle, mainLength);
}
function getRandomGreen() {
    let green = Math.floor(Math.random() * 256);
    return 'rgb(0,' + green + ',0)';
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getBase(canvas){
    return [parseInt(canvas.width / 2), canvas.height];
}
function getNextPoint(canvas, currentPoint, maxLength, maxAngle, hasScaler = true){
    var length = maxLength;
    var scaler = 1 - (currentPoint[1] / canvas.height);
    var angle = getRandomArbitrary(-1 * (maxAngle / 3), maxAngle);
    var direction = Math.random();
    if(direction <= 0.5){
        if(hasScaler){
            var x = currentPoint[0] + ((length * Math.cos((angle * (Math.PI / 180) - (180 * (Math.PI / 180))))) * scaler);
        }else{
            var x = currentPoint[0] + ((length * Math.cos((angle * (Math.PI / 180) - (180 * (Math.PI / 180))))));
        }
    }else{
        if(hasScaler){
            var x = currentPoint[0] + ((length * Math.cos(angle * (Math.PI / 180))) * scaler);
        }else{
            var x = currentPoint[0] + ((length * Math.cos(angle * (Math.PI / 180))));
        }
    }
    var y = currentPoint[1] - (length * Math.sin(angle * (Math.PI / 180)));
    return [x, y];
}
function buildLeaves(point, radiusX, radiusY, color = "Black"){
    let leafColor = getRandomGreen();
    ctx.strokeStyle = leafColor;
    ctx.fillStyle = leafColor;
    let leafNumber = Math.floor(getRandomArbitrary(3, 10));
    let currentLineWidth = ctx.lineWidth;
    ctx.lineWidth = 1;
    for (let index = 0; index < leafNumber; index++) {
        ctx.beginPath();
        let arr = [0, Math.PI / 2, Math.PI / 4];
        let randomIndex = Math.floor(Math.random() * arr.length);
        let rotation = arr[randomIndex];
        ctx.ellipse(point[0] + Math.floor(getRandomArbitrary(-60, 60)), point[1] + Math.floor(getRandomArbitrary(-60, 60)), radiusX, radiusY, rotation, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        
    }
    ctx.lineWidth = currentLineWidth;
}
function buildTree(canvas, maxPoints, angle, length){
    angle = angle + getRandomArbitrary(-10, 10);
    ctx.beginPath();
    ctx.strokeStyle = "Black";
    //LOOP THROUGH ALL NUMBER OF POSSIBLE MAIN POINTS
    for (let index = 0; index < maxPoints; index++) {
        ctx.strokeStyle = "Black";
        //CALCULATE CHANCE OF SPLIT
        let chance = getRandomArbitrary(1, maxPoints) * 100;
        let current = (1 - (index / maxPoints)) * 100;

        //BUILD MAIN
        pathPoints.push(getNextPoint(canvas, pathPoints[pathPoints.length - 1], length, angle));
        if (index == 0) {
            ctx.lineTo(pathPoints[pathPoints.length - 2][0], pathPoints[pathPoints.length - 2][1]);
        }
        ctx.lineTo(pathPoints[pathPoints.length - 1][0], pathPoints[pathPoints.length - 1][1]);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(pathPoints[pathPoints.length - 1][0], pathPoints[pathPoints.length - 1][1]);
        let currentP = [
            pathPoints[pathPoints.length - 1][0],
            pathPoints[pathPoints.length - 1][1]
        ];

        //BUILD SPLIT
        if(chance > current && (index / maxPoints) > getRandomArbitrary(0.3, 0.9)){
            ctx.strokeStyle = "Black";
            let branchPointsR = [];
            branchPointsR.push(currentP);
            let branchNum = parseInt(getRandomArbitrary(1, parseInt(maxPoints / 2)));
            for (let r = 0; r < branchNum; r++) {
                ctx.strokeStyle = "Black";
                branchPointsR.push(getNextPoint(canvas, branchPointsR[branchPointsR.length - 1], length / 3, angle));
                ctx.lineTo(branchPointsR[branchPointsR.length - 1][0], branchPointsR[branchPointsR.length - 1][1]);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(branchPointsR[branchPointsR.length - 1][0], branchPointsR[branchPointsR.length - 1][1]);
                // ctx.strokeStyle = leafColor;
                leafPoints.push(branchPointsR[branchPointsR.length - 1]);
                // buildLeaves(branchPointsR[branchPointsR.length - 1], Math.floor(getRandomArbitrary(1, 6)), Math.floor(getRandomArbitrary(1, 10)), leafColor);
            }
        }
        ctx.moveTo(currentP[0], currentP[1]);

        //DECREASE LINE WIDTH
        ctx.lineWidth = lineWidth - ((index / maxPoints) * lineWidth);
    }
}

//SET UP CANVAS
canvas.style.border = "3px solid grey";

//Built Tree Path
var pathPoints = [];
var leafPoints = [];
for (let i = 0; i < treeNumbers; i++) {
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    pathPoints.push([Math.floor(getRandomArbitrary(0, canvas.width)), canvas.height]);
    ctx.moveTo(pathPoints[pathPoints.length - 1][0], pathPoints[pathPoints.length - 1][1]);
    console.log(pathPoints[pathPoints.length - 1][0], pathPoints[pathPoints.length - 1][1]);
    buildTree(canvas, mainPoints, mainAngle, mainLength);
}
leafPoints.forEach(element => {
    buildLeaves(element, Math.floor(getRandomArbitrary(1, 6)), Math.floor(getRandomArbitrary(1, 10)));
});