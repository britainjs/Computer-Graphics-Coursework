//A function to tile the canvas with purple squares
(function () {
     var canvas = document.getElementById("canvas"),
     renderingContext = canvas.getContext("2d");
     
     renderingContext.fillStyle = "lavender";
     //tile the canvas
     // JD: Some unnecessary hardcoding here---this will force
     //     you to modify this code if someone edits the size
     //     of the canvas in the .html file.
     //
     //     Note also that even for loop variables are preferrably
     //     declared up top, to match JavaScript semantics.
     for(var i = 0; i <= 462; i+= 51){
        for(var j = 0; j <= 462; j+= 51){
            renderingContext.fillRect(i, j, 50, 50);
        }
     }
 }());
