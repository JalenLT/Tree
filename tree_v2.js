//GET HTML ELEMENTS
const canvas = document.getElementsByName("tree")[0];
const ctx = canvas.getContext("2d");
ctx.lineCap = "round";
// ctx.lineJoin = "round";
var lineWidth = 30;
ctx.lineWidth = lineWidth;
var mainLength = 100;
var mainAngle = 20;
var mainPoints = 30;
var splitChance = 30;
var treeNumbers = 1;
var treePoints = {
    "branches" : {},
    "lineWidths": [],
    "branchNumber": 0,
    "completeBranches": 0,
    "highestY": 99999
};

function getRandomGreen() {
    let green = Math.floor(Math.random() * 256);
    return 'rgb(0,' + green + ',0)';
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
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

addBranch(treePoints);
//CREATE POINTS FOR TREE BASE
for (let i = 0; i < mainPoints; i++) {
    addOnBranch(treePoints, "branch_1", mainLength, mainAngle);

    var branchChance = Math.floor(getRandomArbitrary(1, 100));
    if((i / mainPoints) > 0.25 && branchChance > (100 - splitChance)){
        addBranch(treePoints, false, treePoints.branches.branch_1[treePoints.branches.branch_1.length - 1]);
    }
}
treePoints.completeBranches += 1;
//BUILD FIRST BRANCH SPLIT
var currentBranchNumber = treePoints.branchNumber - 1;
for (let i = 0; i < currentBranchNumber; i++) {
    var splitCount = Math.floor(getRandomArbitrary(1, mainPoints / 2));
    if(i + 1 != 1){
        for (let r = 0; r < splitCount; r++) {
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
        addOnBranch(treePoints, "branch_" + (i + 1), mainLength * 0.3, mainAngle * 2);
        var branchChance = Math.floor(getRandomArbitrary(1, 100));
    }
}
treePoints.completeBranches = treePoints.branchNumber;
//DRAW TREE PATH
for (let i = 0; i < treePoints.branchNumber; i++) {
    let currentBranchWidth = 0;
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
            let w = lineWidth * (1 - (treePoints["highestY"] / treePoints.branches["branch_" + (i + 1)][r][1]));
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
    // treePoints.branches["branch_" + (i + 1)].forEach((element, i) => {
    //     if(i == 0){
    //         ctx.moveTo(element[0], element[1]);
    //     }else{
    //         ctx.lineTo(element[0], element[1]);
    //     }
    // });
}

console.log(treePoints);

//DRAW PERPENDICULAR LINE
// var slope_ab = (treePoints.branches.branch_1[8][1] - treePoints.branches.branch_1[7][1]) / (treePoints.branches.branch_1[8][0] - treePoints.branches.branch_1[7][0]);
// var slope_perpendicular = -1 / slope_ab;
// var x3 = treePoints.branches.branch_1[7][0] + 5;
// var y3 = treePoints.branches.branch_1[7][1] + slope_perpendicular * (x3 - treePoints.branches.branch_1[7][0]);
// var x4 = treePoints.branches.branch_1[7][0] + 15;
// var y4 = treePoints.branches.branch_1[7][1] + slope_perpendicular * (x4 - treePoints.branches.branch_1[7][0]);
// console.log(slope_ab);
// console.log(slope_perpendicular);
// ctx.beginPath();
// ctx.strokeStyle = "Blue";
// ctx.moveTo(x3, y3);
// ctx.lineTo(x4, y4);
// ctx.stroke();
// ctx.beginPath();
// ctx.strokeStyle = "Green";
// ctx.moveTo(treePoints.branches.branch_1[7][0], treePoints.branches.branch_1[7][1]);
// ctx.lineTo(treePoints.branches.branch_1[8][0], treePoints.branches.branch_1[8][1]);
// ctx.stroke();

// var startPoint = { 0: 50, 1: 50 };
// var endPoint = { 0: 200, 1: 200 };

// var controlPoints = getControlPoints(startPoint, endPoint);

// ctx.beginPath();
// ctx.moveTo(startPoint[0], startPoint[1]);
// ctx.bezierCurveTo(
//   controlPoints[0][0], controlPoints[0][1],
//   controlPoints[1][0], controlPoints[1][1],
//   endPoint[0], endPoint[1]
// );
// ctx.stroke();