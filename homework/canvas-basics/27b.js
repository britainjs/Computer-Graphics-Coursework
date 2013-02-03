//A function to draw a fake 3d cube with grayscale sides.
(function () {
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d");

    // JD: The final look is nicely done.  However, I think
    //     you could have separated the cube's data from the
    //     drawing instructions better.  Note how many sides
    //     or coordinates are either shared or derived.

    //Style and draw the right side
    renderingContext.fillStyle = "rgb(72,72,72) ";
    renderingContext.beginPath();
    renderingContext.moveTo(461, 511);
    renderingContext.lineTo(511, 486);
    renderingContext.lineTo(511, 411);
    renderingContext.lineTo(461, 436);
    renderingContext.closePath();
    renderingContext.fill();
    
    //Style and draw the left side
    renderingContext.fillStyle = "rgb(128,128,128)  "
    renderingContext.beginPath();
    renderingContext.moveTo(461, 511);
    renderingContext.lineTo(411, 486);
    renderingContext.lineTo(411, 411);
    renderingContext.lineTo(461, 436);
    renderingContext.closePath();
    renderingContext.fill();
    
    //Style and draw the top
    renderingContext.fillStyle = "rgb(216,216,216)";
    renderingContext.beginPath();
    renderingContext.moveTo(461, 436);
    renderingContext.lineTo(411, 411);
    renderingContext.lineTo(461, 386);
    renderingContext.lineTo(511, 411);
    renderingContext.fill();
}());