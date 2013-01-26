//A function to draw a simple sunset scene with a red sun setting into a dark blue ocean
//with a partial reflection.
(function () {
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d");
    //draw the sky
    renderingContext.fillStyle = "rgb(176, 196, 222)";
    renderingContext.fillRect(0, 0, 512, 512);
    
    //draw the ocean
    renderingContext.fillStyle = "rgb(0, 0, 102)";
    renderingContext.fillRect(0, 300, 512, 512);
    
    //draw the sun
    renderingContext.fillStyle = "rgb(247, 78, 5)";
    renderingContext.arc(256, 300, 60, 0, Math.PI, true);
    renderingContext.fill();
    
    //draw the reflection
    renderingContext.fillStyle = "rgba(247, 78, 5, .45)";
    //scale for water distortion. Not sure if it looks better with or without.
    //renderingContext.scale(1, 1.025);
    renderingContext.arc(256, 300, 60, Math.PI, 0, true);
    renderingContext.translate(59, 0);
    renderingContext.fill();
}());