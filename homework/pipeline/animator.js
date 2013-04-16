var Animator = {
    //A function to make an array of objects over up and down and rotate.
    hover: function (shapes, dy, rotation) {
            var i;
            for (i = 0; i < shapes.length; i++) {
                shapes[i].transform.angle = rotation;
                shapes[i].transform.dy = dy;
            }
    },
    
    //A function to make an object rotate in a circle.
    orbit: function (shapes, rotation) {
        var i;
        for (i = 0; i < shapes.length; i++) {
            shapes[i].transform.dx = Math.sin (rotation);
            shapes[i].transform.dz = Math.cos (rotation);
        }
    }
};
