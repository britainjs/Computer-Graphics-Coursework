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
            height = canvas.height;
            renderingContext.fillStyle = "red";
            renderingContext.beginPath();
            renderingContext.arc(100, height, 20, 0, 2 * Math.PI, true);
            renderingContext.fill();
            renderingContext.beginPath();
            renderingContext.moveTo(100, height + 20);
            renderingContext.quadraticCurveTo(120, height + 40, 100, height + 50);
            renderingContext.quadraticCurveTo(80, height + 60, 100, height + 80);
            renderingContext.stroke();
        },
        
        bird = function (renderingContext) {
            width = canvas.width
            renderingContext.beginPath();
            renderingContext.moveTo(width, 200);
            renderingContext.lineTo(width + 30, 230);
            renderingContext.moveTo(width, 200);
            renderingContext.lineTo(width + 30, 170);
            renderingContext.stroke();
        },
        
        bird1 = function (renderingContext) {
            width = canvas.width
            renderingContext.beginPath();
            renderingContext.moveTo(width, 200);
            renderingContext.lineTo(width + 10, 230);
            renderingContext.moveTo(width, 200);
            renderingContext.lineTo(width + 10, 170);
            renderingContext.stroke();
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
                currentInner: 0,
                innerFrame : 0,
                keyframes: [
                    {
                        frame: 0,
                        tx: 0,
                        ty: 0,
                        ease: KeyframeTweener.linear
                    },

                    {
                        frame: 100,
                        tx: 0,
                        ty: -400,
                        ease: KeyframeTweener.linear
                    },

                    {
                        frame: 175,
                        tx: 0,
                        ty: -600,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 180,
                        tx: -20,
                        ty: -550,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 200,
                        tx: -20,
                        ty: -600
                    }
                ]
            },
            
            {
                draw : [bird, bird1],
                currentInner: 0,
                innerFrame: 15,
                keyframes: [
                    {
                        frame: 0,
                        tx: 0,
                        ty: 20,
                        ease : KeyframeTweener.linear
                    },
                    
                    {
                        frame : 100,
                        tx: -500,
                        ty: 20,
                        ease: KeyframeTweener.easeInOutCirc
                    },
                    
                    {
                        frame: 175,
                        tx: -900,
                        ty: 100,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 200,
                        tx: -1000,
                        ty: -100
                    }
                ]
            }
            
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