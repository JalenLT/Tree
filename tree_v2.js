//GET HTML ELEMENTS
const canvas = document.getElementsByName("tree")[0];
const ctx = canvas.getContext("2d");
// ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.lineWidth = 3;
var lineWidth = 20;
var mainLength = 100;
var mainAngle = 20;
var mainPoints = 30;
var splitChance = 30;
var treeNumbers = 1;
var treePoints = {
    "branches" : {},
    "branchNumber": 0,
    "completeBranches": 0
};

function getRandomGreen() {
    let green = Math.floor(Math.random() * 256);
    return 'rgb(0,' + green + ',0)';
}
function distanceBetweenPoints(point1, point2){
    return Math.sqrt(Math.pow((point2[0] - point1[0]), 2) + Math.pow((point2[1] - point1[1]), 2));
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
        if(closestDistance > 15){
            canContinue = true;
        }else{
            currentLength += 0.3;
            nextPoint = getNextPoint(canvas, treePoints.branches[branchIndex][treePoints.branches[branchIndex].length - 1], currentLength, angle);
        }
    }
    treePoints.branches[branchIndex].push(nextPoint);
}

addBranch(treePoints);
//CREATE POINTS FOR TREE BASE
for (let i = 0; i < mainPoints; i++) {
    addOnBranch(treePoints, "branch_1", mainLength, mainAngle);

    var branchChance = Math.floor(getRandomArbitrary(1, 100));
    if((i / mainPoints) > 0.3 && branchChance > (100 - splitChance)){
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
    ctx.beginPath();
    treePoints.branches["branch_" + (i + 1)].forEach((element, i) => {
        if(i == 0){
            ctx.moveTo(element[0], element[1]);
        }else{
            ctx.lineTo(element[0], element[1]);
        }
    });
    ctx.stroke();
}

console.log(Math.sqrt(Math.pow(treePoints.branches.branch_1[1][0] - treePoints.branches.branch_1[0][0], 2) + Math.pow(treePoints.branches.branch_1[1][1] - treePoints.branches.branch_1[0][1], 2)));

console.log(treePoints);