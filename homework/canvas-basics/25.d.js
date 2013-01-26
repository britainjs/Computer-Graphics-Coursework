//A function to draw an orange X spanning the canvas.
(function () {
     var canvas = document.getElementById("canvas"),
     renderingContext = canvas.getContext("2d");
     
     //draw the X
     renderingContext.strokeStyle = "orange";
     renderingContext.beginPath();
     renderingContext.moveTo(0,0);
     renderingContext.lineTo(511,511);
     renderingContext.moveTo(511, 0);
     renderingContext.lineTo(0, 511);
     renderingContext.stroke();
 
 }());