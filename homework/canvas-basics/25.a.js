//A function to draw a blue box centered on the screen
(function () {
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d");
        
    //draw the square.
    renderingContext.fillStyle = "rgb(0, 0, 200)";
    renderingContext.fillRect(256, 256, 50, 50);
}());