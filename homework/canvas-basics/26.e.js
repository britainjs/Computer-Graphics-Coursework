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

    renderingContext.fillStyle = "purple";
    renderingContext.beginPath();
    renderingContext.arc(256, 256, 75, 0, Math.PI * 2, true);
    renderingContext.arc(256, 356, 75, 0, Math.PI * 2, true);
    renderingContext.fill();
}());