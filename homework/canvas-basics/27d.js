//A function to draw a yellow smiley with a radial gradient to fake a spherical look
(function () {
    // Ditto on using jQuery here.
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d"),
        radialGradient = renderingContext.createRadialGradient(50, 50, 7, 60, 60, 100 );

    radialGradient.addColorStop(0, "white");
    radialGradient.addColorStop(1, "yellow");

    renderingContext.fillStyle = radialGradient;
    //draw the circle.
    renderingContext.beginPath();
    renderingContext.arc(75,75,50,0,Math.PI*2,true);
    //fill the outer circle so the face draws on top of it.
    renderingContext.fill();
    
    //draw the smiley. Adapted from Mozilla's canvas tutorial.
    renderingContext.beginPath();
    renderingContext.moveTo(110,75);
    renderingContext.arc(75,75,35,0,Math.PI,false);   // Mouth (clockwise)
    renderingContext.moveTo(65,65);
    renderingContext.arc(60,65,5,0,Math.PI*2,true);  // Left eye
    renderingContext.moveTo(95,65);
    renderingContext.arc(90,65,5,0,Math.PI*2,true);  // Right eye
    renderingContext.stroke(); 
}());