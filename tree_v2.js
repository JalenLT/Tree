//GET HTML ELEMENTS
const canvas = document.getElementsByName("tree")[0];
canvas.width = window.innerWidth * 0.75;
const ctx = canvas.getContext("2d", {willReadFrequently: true});
ctx.lineCap = "round";
// ctx.lineJoin = "round";
var lineWidth = 30;
ctx.lineWidth = lineWidth;
var mainLength = 100;
var mainAngle = 20;
var mainPoints = 30;
var splitChance = 30;
var pixelSize = 5;
var treeNumbers = Math.floor(getRandomArbitrary(1, 2));
var trees = [];
var treePoints = {
    "branches" : {},
    "leaves": [],
    "lineWidths": [],
    "branchNumber": 0,
    "completeBranches": 0,
    "highestY": 99999
};
var colorPoints = [];
var shadowLevels = 4;
var shadows = [];
var lightPoint = [canvas.width, 0];

for (let i = 0; i < shadowLevels; i++) {
    shadows.push("rgba(0, 0, 0, " + ((1 / (shadowLevels * 2)) * (i + 1)) + ")");
}
console.log(shadows);

function getRandomGreen() {
    let green = Math.floor(Math.random() * 256);
    return 'rgb(0,' + green + ',0)';
}
function getPerpendicularPoint(startPoint, endPoint, distance) {
    // Generate a random point between the start and end points
    var randomPoint = [Math.random() * (endPoint[0] - startPoint[0]) + startPoint[0], Math.random() * (endPoint[1] - startPoint[1]) + startPoint[1]];

    // Calculate the direction vector of the line formed by the start and end points
    var directionVector = [endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]];

    // Normalize the direction vector
    var magnitude = Math.sqrt(directionVector[0] ** 2 + directionVector[1] ** 2);
    var normalizedDirection = [directionVector[0] / magnitude, directionVector[1] / magnitude];

    // Calculate the perpendicular vector
    var perpendicularVector = [normalizedDirection[1], -normalizedDirection[0]];

    // Calculate the perpendicular point by offsetting from the random point
    var perpendicularPoint = [randomPoint[0] + perpendicularVector[0] * distance, randomPoint[1] + perpendicularVector[1] * distance];

    return perpendicularPoint;
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
// Get the color of a specific coordinate
function getColorAtCoordinate(x, y) {
    // Get the image data of the canvas
    const imageData = ctx.getImageData(x, y, 1, 1);
    const data = imageData.data;
    // Return the color as an RGB string
    return data;
  }
function getControlPoints(startPoint, endPoint, curvature = 10) {
    // Calculate the mid-point
    var midPoint = {
        x: (startPoint[0] + endPoint[0]) / 2,
        y: (startPoint[1] + endPoint[1]) / 2
    };

    // Calculate random offsets for the control points
    var offset1 = getRandomArbitrary(-1 * curvature, curvature);
    var offset2 = getRandomArbitrary(-1 * curvature, curvature);

    // Calculate the control points
    var controlPoint1 = {
        0: startPoint[0],
        1: startPoint[1] + offset1
    };

    var controlPoint2 = {
        0: endPoint[0],
        1: endPoint[1] + offset2
    };

    // Return the control points
    return [controlPoint1, controlPoint2];
}
  
function distanceBetweenPoints(point1, point2){
    return Math.sqrt(Math.pow((point2[0] - point1[0]), 2) + Math.pow((point2[1] - point1[1]), 2));
}
function getBase(canvas){
    return [Math.floor(getRandomArbitrary(1, canvas.width)), canvas.height];
}
function getNextPoint(canvas, currentPoint, maxLength, maxAngle, hasScaler = true, up = false){
    var length = maxLength;
    var scaler = 1 - (currentPoint[1] / canvas.height);
    var angle = getRandomArbitrary(-1 * (maxAngle / 3), maxAngle);
    var direction = Math.random();
    if(!up){
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
    }else{
        var x = currentPoint[0] + ((length * Math.cos((angle * (Math.PI / 180) - (300 * (Math.PI / 180))))));
    }
    var y = currentPoint[1] - (length * Math.sin(angle * (Math.PI / 180)));
    return [x, y];
}
function getPointGivenTwo(point1, point2, desiredDistance){
    // Example arrays holding the x and y values of the original points
    var originalX = [point1[0], point2[0]];
    var originalY = [point1[1], point2[1]];

    // Calculate the distance between the two original points using the Pythagorean theorem
    var dx = originalX[1] - originalX[0];
    var dy = originalY[1] - originalY[0];
    var totalDistance = Math.sqrt(dx ** 2 + dy ** 2);

    // Calculate the ratio of the desired distance to the total distance
    var ratio = desiredDistance / totalDistance;

    // Calculate the x and y coordinates of the desired point
    var desiredX = originalX[0] + (dx * ratio);
    var desiredY = originalY[0] + (dy * ratio);

    return [desiredX, desiredY];
}
function addBranch(treePoints, base = true, currentPoint = []){
    treePoints.branchNumber += 1;
    var index = "branch_" + treePoints.branchNumber;
    treePoints.branches[index] = [];
    if(base){
        treePoints.branches[index].push(getBase(canvas));
    }else{
        treePoints.branches[index].push(currentPoint);
        treePoints.branches[index].push(getNextPoint(canvas, currentPoint, mainLength, mainAngle));
    }
}
function addOnBranch(treePoints, branchIndex, length, angle){
    var nextPoint = getNextPoint(canvas, treePoints.branches[branchIndex][treePoints.branches[branchIndex].length - 1], length, angle);
    var canContinue = false;
    var currentLength = length;
    while (!canContinue) {
        var closestDistance = 99999999;
        for (let i = 0; i < treePoints.branchNumber; i++) {
            treePoints.branches["branch_" + (i + 1)].forEach(element => {
                var distance = distanceBetweenPoints(element, nextPoint);
                if(distance < closestDistance){
                    closestDistance = distance;
                }
            });
        }
        if(closestDistance > 20){
            canContinue = true;
        }else{
            currentLength += 0.3;
            nextPoint = getNextPoint(canvas, treePoints.branches[branchIndex][treePoints.branches[branchIndex].length - 1], currentLength, angle);
        }
    }
    if(nextPoint[1] < treePoints["highestY"]){
        treePoints["highestY"] = nextPoint[1];
    }
    treePoints.branches[branchIndex].push(nextPoint);
}
function addLeaves(treePoints, currentPoint, length, angle, distance, minLeaves = 5, maxLeaves = 15){
    ctx.fillStyle = "Green";
    var totalLeaves = Math.floor(getRandomArbitrary(minLeaves, maxLeaves));
    for (let i = 0; i < totalLeaves; i++) {
        let start = [currentPoint[0] + getRandomArbitrary(-1 * 40, 40), currentPoint[1] + getRandomArbitrary(-1 * 40, 40)];
        let end = getNextPoint(canvas, start, 30, angle * 2);
        let control1 = getPerpendicularPoint(start, end, distance);
        let control2 = getPerpendicularPoint(start, end, -1 * distance);
        let middle = getPerpendicularPoint(start, end, 0.1);
        treePoints.leaves.push([start, end, control1, control2, middle]);
    }
}
function addGrass(canvas, length, angle){
    ctx.lineWidth = 1;
    if(0.8 < Math.random()){
        var startPoint1 = [trees[Math.floor(getRandomArbitrary(0, trees.length - 1))]["branches"]["branch_1"][0][0] + getRandomArbitrary(-100, 100), trees[Math.floor(getRandomArbitrary(0, trees.length - 1))]["branches"]["branch_1"][0][1]];
    }else{
        var startPoint1 = getBase(canvas);
    }
    var startPoint2 = [startPoint1[0] + getRandomArbitrary(1, 3), startPoint1[1]];
    length += getRandomArbitrary(5, 35);
    var endPoint = getNextPoint(canvas, startPoint1, length, angle, false, true);
    var controlPoints = getControlPoints(startPoint1, endPoint, 10);
    ctx.beginPath();
    ctx.moveTo(startPoint1[0], startPoint1[1]);
    ctx.bezierCurveTo(
        controlPoints[0][0], controlPoints[0][1],
        controlPoints[1][0], controlPoints[1][1],
        startPoint2[0], 
        startPoint2[1]
    );
    ctx.stroke();
    ctx.fill();
}

function drawTree(){
    treePoints = {
        "branches" : {},
        "leaves": [],
        "lineWidths": [],
        "branchNumber": 0,
        "completeBranches": 0,
        "highestY": 99999
    };
    mainPoints = Math.floor(getRandomArbitrary(20, 50));

    addBranch(treePoints);
    //CREATE POINTS FOR TREE BASE
    var branchHeight = getRandomArbitrary(0.1, 0.4);
    for (let i = 0; i < mainPoints; i++) {
        addOnBranch(treePoints, "branch_1", mainLength, mainAngle);
        
        var branchChance = Math.floor(getRandomArbitrary(1, 100));
        if((i / mainPoints) > branchHeight && branchChance > (100 - splitChance)){
            addBranch(treePoints, false, treePoints.branches.branch_1[treePoints.branches.branch_1.length - 1]);
        }
        if((i / mainPoints) > branchHeight){
            //ADD LEAVES
            addLeaves(treePoints, treePoints.branches["branch_1"][treePoints.branches["branch_1"].length - 1], mainLength / 8, mainAngle, 5);
        }
    }
    treePoints.completeBranches += 1;
    //BUILD FIRST BRANCH SPLIT
    var currentBranchNumber = treePoints.branchNumber - 1;
    for (let i = 0; i < currentBranchNumber; i++) {
        var splitCount = Math.floor(getRandomArbitrary(1, mainPoints / 2));
        if(i + 1 != 1){
            for (let r = 0; r < splitCount; r++) {
                //ADD LEAVES
                addLeaves(treePoints, treePoints.branches["branch_" + (i + 1)][treePoints.branches["branch_" + (i + 1)].length - 1], mainLength / 8, mainAngle, 5);
    
                addOnBranch(treePoints, "branch_" + (i + 1), mainLength * 0.6, mainAngle * 1.5);
                var branchChance = Math.floor(getRandomArbitrary(1, 100));
                if(branchChance > (100 - splitChance)){
                    addBranch(treePoints, false, treePoints.branches["branch_" + (i + 1)][treePoints.branches["branch_" + (i + 1)].length - 1]);
                }
            }
        }
        treePoints.completeBranches += 1;
    }
    //BUILD SECOND BRANCH SPLIT
    for (let i = treePoints.completeBranches; i < treePoints.branchNumber; i++) {
        for (let r = 0; r < splitCount; r++) {
            //ADD LEAVES
            addLeaves(treePoints, treePoints.branches["branch_" + (i + 1)][treePoints.branches["branch_" + (i + 1)].length - 1], mainLength / 8, mainAngle, 5);
            
            addOnBranch(treePoints, "branch_" + (i + 1), mainLength * 0.3, mainAngle * 2);
            var branchChance = Math.floor(getRandomArbitrary(1, 100));
        }
    }
    treePoints.completeBranches = treePoints.branchNumber;
    //DRAW TREE PATH
    for (let i = 0; i < treePoints.branchNumber; i++) {
        for (let r = 0; r < treePoints.branches["branch_" + (i + 1)].length; r++) {
            ctx.beginPath();
            if(r == 0){
                ctx.moveTo(treePoints.branches["branch_" + (i + 1)][r][0], treePoints.branches["branch_" + (i + 1)][r][1]);
            }else{
                ctx.moveTo(treePoints.branches["branch_" + (i + 1)][r - 1][0], treePoints.branches["branch_" + (i + 1)][r - 1][1]);
                let controlPoints = getControlPoints(treePoints.branches["branch_" + (i + 1)][r - 1], treePoints.branches["branch_" + (i + 1)][r]);
                ctx.bezierCurveTo(
                    controlPoints[0][0], controlPoints[0][1],
                    controlPoints[1][0], controlPoints[1][1],
                    treePoints.branches["branch_" + (i + 1)][r][0], 
                    treePoints.branches["branch_" + (i + 1)][r][1]
                );
            }
            
            if(i == 0){
                let w = lineWidth * (1 - ((r + 1) / treePoints.branches["branch_" + (i + 1)].length));
                treePoints["lineWidths"].push([treePoints.branches["branch_" + (i + 1)][r][0], treePoints.branches["branch_" + (i + 1)][r][1], w]);
                ctx.lineWidth = w;
            }else{
                if(r == 0){
                    treePoints["lineWidths"].forEach(element => {
                        if(treePoints.branches["branch_" + (i + 1)][r][0] == element[0] && treePoints.branches["branch_" + (i + 1)][r][1] == element[1]){
                            currentBranchWidth = element[2];
                        }
                    });
                }
                let w = currentBranchWidth * (1 - ((r + 1) / treePoints.branches["branch_" + (i + 1)].length));
                treePoints["lineWidths"].push([treePoints.branches["branch_" + (i + 1)][r][0], treePoints.branches["branch_" + (i + 1)][r][1], w]);
                ctx.lineWidth = w;
            }
            
            ctx.stroke();
        }
    }
    //DRAW LEAVES
    // ctx.strokeStyle = "Green";
    // ctx.fillStyle = "Green";
    // for (let i = 0; i < treePoints.leaves.length; i++) {
    //     let leaf = treePoints.leaves[i];
    //     ctx.lineWidth = 2;
    //     ctx.beginPath();
    //     ctx.moveTo(leaf[0][0], leaf[0][1]);
    //     ctx.quadraticCurveTo(leaf[2][0], leaf[2][1], leaf[1][0], leaf[1][1]);
    //     ctx.stroke();
    //     ctx.closePath();
    //     ctx.fill();
    //     ctx.beginPath();
    //     ctx.moveTo(leaf[0][0], leaf[0][1]);
    //     ctx.quadraticCurveTo(leaf[3][0], leaf[3][1], leaf[1][0], leaf[1][1]);
    //     ctx.stroke();
    //     ctx.closePath();
    //     ctx.fill();
    // }
    ctx.strokeStyle = "Black";
    ctx.fillStyle = "Black";
    trees.push(treePoints);
}
// DRAW TREES
for (let i = 0; i < treeNumbers; i++) {
    ctx.strokeStyle = "Brown";
    ctx.fillStyle = "Brown";
    drawTree();
    ctx.strokeStyle = "Black";
    ctx.fillStyle = "Black";
}
function treeCanvas() {
    ctx.clearRect(0, 0, canvas.width + 100, canvas.height + 100);
    ctx.strokeStyle = "Brown";
    ctx.fillStyle = "Brown";
    drawTree();
    ctx.strokeStyle = "Black";
    ctx.fillStyle = "Black";
}
//DRAW GRASS
for (let i = 0; i < Math.floor(getRandomArbitrary(200, 500)); i++) {
    addGrass(canvas, Math.floor(getRandomArbitrary(20, 180)), 40);
}

//PIXELATE CANVAS
function pixelateCanvas() {
    colorPoints = [];
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var chunksX = Math.floor(canvasWidth / pixelSize);
    var chunksY = Math.floor(canvasHeight / pixelSize);
    for (let r = 0; r < chunksY; r++) {
        for (let i = 0; i < chunksX; i++) {
            let canDraw = true;
            let blackCount = 0;
            // console.log((i * pixelSize) + " " + (r * pixelSize));
            let middleX = Math.floor(((i * pixelSize) + ((i * pixelSize) + pixelSize)) / 2);
            let middleY = Math.floor(((r * pixelSize) + ((r * pixelSize) + pixelSize)) / 2);
            let color = getColorAtCoordinate(middleX, middleY);
            if(color[3] == 0){
                canDraw = false;
            }

            if(canDraw){
                colorPoints.push([(i * pixelSize), (r * pixelSize)]);
                ctx.fillStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
            }else{
                ctx.fillStyle = "White";
            }
            ctx.beginPath();
            ctx.rect(i * pixelSize, r * pixelSize, pixelSize, pixelSize)
            ctx.fill();
        }
    }
}
function addShadow() {
    for (let i = 0; i < colorPoints.length; i++) {
        
    }
}

var thirdPoint = getPointGivenTwo([10, 200], [100, 500], 10);
ctx.beginPath();
ctx.rect(10, 200, 3, 3);
ctx.fill();
ctx.beginPath();
ctx.rect(100, 500, 3, 3);
ctx.fill();
ctx.beginPath();
ctx.rect(thirdPoint[0], thirdPoint[1], 3, 3);
ctx.fill();
console.log(thirdPoint);