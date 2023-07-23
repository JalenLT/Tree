# Tree with Light and Shadow Simulation

This is a JavaScript script that generates a tree with lights and shadows on an HTML canvas.

## Result
![Tree 11](https://github.com/JalenLT/Tree/assets/127210112/f8a45340-94b5-4add-bf25-c411985fb085)

## Getting Started

To use this script, you need an HTML file with a canvas element named "tree" on which the tree will be drawn. Make sure to adjust the canvas dimensions according to your requirements.

```html
<canvas name="tree" width="1920" height="1080"></canvas>
```

## Usage

To generate the tree with lights and shadows, call the drawTree() function.

```javascript
drawTree();
```
By default, the script will draw multiple trees on the canvas. You can control the number of trees by changing the 'treeNumbers' variable.

```javascript
var treeNumbers = 3; // Change the number of trees here
```

## Customization
The script provides various parameters that you can adjust to customize the appearance of the tree simulation.

### Tree Parameters
You can modify the following variables to adjust the tree's appearance:
```javascript
var mainLength = 100; // Length of the main branches
var mainAngle = 20; // Angle of the main branches
var mainPoints = 30; // Number of main branches
var splitChance = 30; // Chance of a branch splitting into two
var pixelSize = 8; // Size of pixels when pixelating the canvas
```
### Lighting and Shadows
The script simulates light and shadows by pixelating the canvas and determining the depths of light and shadow at each pixel. You can customize the parameters for light and shadow levels:
```javascript
var shadowLevels = 2; // Number of shadow levels
var lightLevels = 2; // Number of light levels
```
You can also set the light point's position and color:
```javascript
var lightPoint = [10, 10]; // [x, y] position of the light source
var lightColor = "rgba(255, 255, 255, 0.8)"; // Color of the light
```
### Sky
You can change the color of the sky:
```javascript
var skyColor = "rgb(179, 230, 255)"; // Color of the sky
```

## Drawing the Tree

The 'drawTree()' function generates and draws the tree based on the provided parameters. You can also use the 'treeCanvas()' function to redraw the tree without generating a new one.

## Additional Features
The script provides some additional functions for generating and customizing the appearance of the tree:
* 'getRandomGreen()': Returns a random green color.
* 'getPerpendicularPoint(startPoint, endPoint, distance)': Calculates a perpendicular point at a specific distance from a line formed by two points.
* 'getRandomArbitrary(min, max)': Returns a random number between 'min' and 'max'.
* 'getColorAtCoordinate(x, y)': Gets the color of a specific coordinate on the canvas.
* 'getControlPoints(startPoint, endPoint, curvature)': Calculates control points for a Bezier curve between two points.
* 'distanceBetweenPoints(point1, point2)': Calculates the distance between two points.
* 'getBase(canvas)': Returns the base point for the tree.
* 'getNextPoint(canvas, currentPoint, maxLength, maxAngle, hasScaler, up)': Calculates the next point for a branch based on the current point, maximum length, and angle.
* 'getPointGivenTwo(point1, point2, desiredDistance)': Calculates a point at a specific distance between two points.
* 'addBranch(treePoints, base, currentPoint)': Adds a branch to the tree.
* 'addOnBranch(treePoints, branchIndex, length, angle)': Adds a new branch on an existing branch.
* 'addLeaves(treePoints, currentPoint, length, angle, distance, minLeaves, maxLeaves)': Adds leaves to a branch.
* 'addGrass(canvas, length, angle)': Adds grass to the canvas.
* 'pixelateCanvas()': Pixelates the canvas based on the pixel size.
* 'addShadow(checkDistance)': Adds shadows to the canvas based on the light source and shadow levels.
* 'addLight(lightDistance)': Adds light to the canvas based on the light source and light levels.
Feel free to modify and experiment with these functions to achieve different effects.


## License

This script is licensed under the MIT License. You are free to use, modify, and distribute the script as per the terms of the license.
