/*
 * This template file is meant to be a template for canvas-based
 * web page code.  Nothing here is set in stone; it is mainly
 * intended to save you some typing.
 */
// Yes, we can use jQuery here, but avoid it just in case you
// really don't want to use it.  We do still keep things away
// from the global namespace.
(function () {
    // Ditto on using jQuery here.
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d"),

        // Declare other variables here.
        radialGradient = renderingContext.createRadialGradient(50, 50, 7, 60, 60, 100 );

    // Put your canvas drawing code (and any other code) here.
    radialGradient.addColorStop(0, "white");
    radialGradient.addColorStop(1, "yellow");

    renderingContext.fillStyle = radialGradient;
    //draw the circle. Adapted from Mozilla's canvas tutorial.
    renderingContext.beginPath();
    renderingContext.arc(75,75,50,0,Math.PI*2,true); // Outer circle
    //fill the outer circle so the face draws on top of it.
    renderingContext.fill();
    renderingContext.beginPath();
    renderingContext.moveTo(110,75);
    renderingContext.arc(75,75,35,0,Math.PI,false);   // Mouth (clockwise)
    renderingContext.moveTo(65,65);
    renderingContext.arc(60,65,5,0,Math.PI*2,true);  // Left eye
    renderingContext.moveTo(95,65);
    renderingContext.arc(90,65,5,0,Math.PI*2,true);  // Right eye
    renderingContext.stroke();
    
}());