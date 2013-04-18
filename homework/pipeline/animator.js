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
    orbit: function (shapes, rotation, horizontalRadius, verticalRadius, xOff, yOff) {
        var i,
            radii = this.getRadii(horizontalRadius, verticalRadius);

        for (i = 0; i < shapes.length; i++) {
            shapes[i].transform.dx = radii.horizontalRadius * Math.sin(rotation) + xOff;
            shapes[i].transform.dy = radii.verticalRadius * Math.cos(rotation) + yOff;
        }
    },

    getRadii: function (horizontalRadius, verticalRadius) {
        var radii = {
                horizontalRadius: horizontalRadius,
                verticalRadius: verticalRadius
            };

        // If neither radius is provided, then we default to a circle of 1.
        // If only the first radius is provided, we have a circle with that
        // radius.  If both are provided, then we have an ellipse.
        if (!(horizontalRadius || verticalRadius)) {
            radii.horizontalRadius = 1;
            radii.verticalRadius = 1;
        } else if (horizontalRadius && !verticalRadius) {
            radii.verticalRadius = horizontalRadius;
        }

        return radii;
    }
};
