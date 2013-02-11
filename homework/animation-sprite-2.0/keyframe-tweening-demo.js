/*
 * This file animates a minimalistic bird which flies through the air along with a rising
 * red balloon. Upon seeing the balloon, the bird takes aim and attacks, smashing the 
 * balloon and causing it to fall.
 */
(function () {
    var canvas = document.getElementById("canvas"),

        //The normal balloon model
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
        
        //The popped balloon model
        balloon1 = function (renderingContext) {
            height = canvas.height;
            renderingContext.fillStyle = "red";
            renderingContext.beginPath();
            renderingContext.moveTo(100, height + 20);
            renderingContext.quadraticCurveTo(90, height - 60, 100, height - 30);
            renderingContext.closePath();
            renderingContext.fill();
            renderingContext.beginPath();
            renderingContext.moveTo(100, height + 20);
            renderingContext.quadraticCurveTo(120, height + 40, 100, height + 50);
            renderingContext.quadraticCurveTo(80, height + 60, 100, height + 80);
            renderingContext.stroke();
        },
        
        // A bird with closed wings
        bird = function (renderingContext) {
            width = canvas.width
            renderingContext.beginPath();
            renderingContext.moveTo(width, 200);
            renderingContext.lineTo(width + 30, 230);
            renderingContext.moveTo(width, 200);
            renderingContext.lineTo(width + 30, 170);
            renderingContext.stroke();
        },
        
        // A bird with wider, open wings
        bird1 = function (renderingContext) {
            width = canvas.width
            renderingContext.beginPath();
            renderingContext.moveTo(width, 200);
            renderingContext.lineTo(width + 10, 230);
            renderingContext.moveTo(width, 200);
            renderingContext.lineTo(width + 10, 170);
            renderingContext.stroke();
        },    
            
        //A blue sky with a yellow sun in the corner
        background = function (renderingContext) {
            renderingContext.fillStyle = "rgb(204, 229, 255)";
            renderingContext.fillRect(0, 0, canvas.width, canvas.height);
            
            renderingContext.fillStyle = "yellow";
            renderingContext.beginPath();
            renderingContext.arc(950, 50, 100, 0, Math.PI * 2);
            renderingContext.fill();
        },

        // Then, we have "easing functions" that determine how
        // intermediate frames are computed.

        // Now, to actually define the animated sprites.  Each sprite
        // has a drawing function and an array of keyframes.
        sprites = [
            {
                draw: [balloon, balloon1],
                currentInner: 0,
                innerFrame : 0,
                customFrame : function (currentFrame) {
                    return (currentFrame >= 180) ? 1 : 0;
                },
                keyframes: [
                    {
                        frame: 0,
                        tx: 50,
                        ty: 0,
                        ease: KeyframeTweener.linear
                    },

                    {
                        frame: 100,
                        tx: 50,
                        ty: -400,
                        ease: KeyframeTweener.linear
                    },

                    {
                        frame: 175,
                        tx: 50,
                        ty: -600,
                        ease: KeyframeTweener.linear
                    },
                    
                    {
                        frame: 185,
                        tx: 20,
                        ty: -600,
                        ease: KeyframeTweener.cubicEaseIn
                    },
                    
                    {
                        frame: 250,
                        tx: 20,
                        ty: 0
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
                        ty: 10,
                        ease: KeyframeTweener.expoEaseIn
                    },
                    
                    {
                        frame: 175,
                        tx: -900,
                        ty: 10,
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
