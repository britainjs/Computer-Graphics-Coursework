//A function to draw an 8 made of overlapping purple circles.
(function () {
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d");
    renderingContext.fillStyle = "purple";
    renderingContext.beginPath();
    //draw the first circle
    renderingContext.arc(256, 256, 75, 0, Math.PI * 2, true);
    //and the second circle about halfway down the first.
    renderingContext.arc(256, 356, 75, 0, Math.PI * 2, true);
    renderingContext.fill();
    // JD: ^^^^^I would argue that stroke would have made for a
    //     more recognizable 8, yes?
}());