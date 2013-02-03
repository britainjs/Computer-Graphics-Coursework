//A function to draw a simple sunset scene with a red sun setting into a green horizon
//under a gray-blue sky.
(function () {
    var canvas = document.getElementById("canvas"),
        renderingContext = canvas.getContext("2d");

    // JD: I'm a tad surprised that you didn't go crazy with gradients
    //     here; this particular picture is very easy to spruce up with
    //     those things.

    //draw the sky
    renderingContext.fillStyle = "rgb(176, 196, 222)";
    renderingContext.fillRect(0, 0, 512, 512);
    
    //draw the ground
    renderingContext.fillStyle = "rgb(0, 200, 0)";
    renderingContext.fillRect(0, 300, 512, 512);
    
    //draw the sun
    renderingContext.fillStyle = "rgb(247, 78, 5)";
    renderingContext.arc(256, 300, 60, 0, Math.PI, true);
    renderingContext.fill();
}());