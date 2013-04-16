var Animator = {
    //A function to make an array of objects over up and down and rotate.
    hover: function (shapes, dy, rotation) {
            var i;
            for (i = 0; i < shapes.length; i++) {
                shapes[i].transform.angle = currentRotation;
                shapes[i].transform.dy = dy;
            }
    }
};
