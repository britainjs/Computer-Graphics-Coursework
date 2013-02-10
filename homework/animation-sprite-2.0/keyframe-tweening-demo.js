/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas"),

        // First, a selection of "drawing functions" from which we
        // can choose.  Their common trait: they all accept a single
        // renderingContext argument.
        balloon = function (renderingContext) {
        
            renderingContext.fillStyle = "red";
            renderingContext.beginPath();
            renderingContext.arc(100, 400, 20, 0, 2 * Math.PI, true);
            renderingContext.fill();
            renderingContext.beginPath();
            renderingContext.moveTo(100, 420);
            renderingContext.quadraticCurveTo(120, 440, 100, 450);
            renderingContext.quadraticCurveTo(80, 460, 100, 480);
            renderingContext.stroke();
        },
        
        bird = function (renderingContext) {
            
            renderingContext.beginPath();
            renderingContext.moveTo(canvas.width, 200);
            renderingContext.lineTo(canvas.width + 70, 230);
            renderingContext.moveTo(canvas.width, 100);
            renderingContext.lineTo(canvas.width + 700, 170);
        },
        
        bird1 = function (renderingContext) {
            
            renderingContext.beginPath();
            renderingContext.moveTo(canvas.width, 200);
            renderingContext.lineTo(canvas.width + 70, 270);
            renderingContext.moveTo(canvas.width, 100);
            renderingContext.lineTo(canvas.width + 700, 130);
        },    
            
        
        background = function (renderingContext) {
            renderingContext.fillStyle = "white";
            renderingContext.fillRect(0, 0, canvas.width, canvas.height);
        },

        // Then, we have "easing functions" that determine how
        // intermediate frames are computed.

        // Now, to actually define the animated sprites.  Each sprite
        // has a drawing function and an array of keyframes.
        sprites = [
            {
                draw: [balloon],
                innerFrame : function (currentFrame) {
                    return 0;
                },
                keyframes: [
                    {
                        frame: 0,
                        tx: 100,
                        ty: 300,
                        ease: KeyframeTweener.linear
                    },

                    {
                        frame: 30,
                        tx: 100,
                        ty: 200,
                        ease: KeyframeTweener.linear
                    },

                    // The last keyframe does not need an easing function.
                    {
                        frame: 200,
                        tx: 80,
                        ty: -500
                    }
                ]
            },
            
            {
                draw :
            
        ];
        

    // Finally, we initialize the engine.  Mainly, it needs
    // to know the rendering context to use.  And the animations
    // to display, of course.
    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites,
        background: background
    });
}());
