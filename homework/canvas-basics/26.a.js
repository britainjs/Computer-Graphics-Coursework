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
 renderingContext = canvas.getContext("2d");
 
 renderingContext.fillStyle = "lavender";
 //loop through the canvas.
 for(var i = 0; i <= 462; i+= 51){
    for(var j = 0; j <= 462; j+= 51){
        renderingContext.fillRect(i, j, 50, 50);
    }
 }
 }());
