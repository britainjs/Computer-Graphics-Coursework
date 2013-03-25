/*
 * This JavaScript file defines a Matrix4x4 object and associated functions.
 * The object itself is returned as the result of a function, allowing us
 * to encapsulate its code and module variables.
 *
 * This module's approach is non-destructive: methods always return new
 * Matrix4x4 objects, and never modify the operands.  This is a design choice.
 *
 * This module is designed for matrices of size 4x4 only.
 */
var Matrix4x4 = (function () {
    // Define the constructor. By default returns the identity matrix.
    var matrix4x4 = function () {
        this.elements = arguments.length ? 
            [].slice.call(arguments) :
                [1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 0, 0, 0, 1]
    };
    
    

    // Multiplication
    matrix4x4.prototype.multiply = function (m) {
        var result = new Matrix4x4(),
            index = 0,
            j,
            k;

            for (j = 0; j < 16; j += 4) {
                for (k = 0; k < 4; k += 1) {
                    result.elements[index] = (this.elements[j] * m.elements[k]) +
                                    (this.elements[j + 1] * m.elements[k + 4]) +
                                    (this.elements[j + 2] * m.elements[k + 8]) +
                                    (this.elements[j + 3] * m.elements[k + 12]);
                    index += 1;
                }
            }
        
        return result;
    },
    
    //Translation. Shifts the point in space by the given x, y, and z coordinate.
    getTranslationMatrix = function (dx, dy, dz) {
        return new matrix4x4(1, 0, 0, dx,
                             0, 1, 0, dy,
                             0, 0, 1, dz,
                             0, 0, 0, 1);
    };
    
    //Scale
    getScaleMatrix = function (sx, sy, sz) {
        if ( (sx <= 0) || (sy <= 0) || (sz <= 0) ) {
            throw "Scale factor must be greater than 0.";
        }
        return new matrix4x4(sx, 0, 0, 0,
                             0, sy, 0, 0,
                             0, 0, sz, 0,
                             0, 0, 0, 1);
    };
    
    getRotationMatrix = function (angle, x, y, z) {
         var axisLength = Math.sqrt((x * x) + (y * y) + (z * z)),
                s = Math.sin(angle * Math.PI / 180.0),
                c = Math.cos(angle * Math.PI / 180.0),
                oneMinusC = 1.0 - c,

                // We can't calculate this until we have normalized
                // the axis vector of rotation.
                x2, // "2" for "squared."
                y2,
                z2,
                xy,
                yz,
                xz,
                xs,
                ys,
                zs;

            // Normalize the axis vector of rotation.
            x /= axisLength;
            y /= axisLength;
            z /= axisLength;

            // *Now* we can calculate the other terms.
            x2 = x * x;
            y2 = y * y;
            z2 = z * z;
            xy = x * y;
            yz = y * z;
            xz = x * z;
            xs = x * s;
            ys = y * s;
            zs = z * s;

            // Presented in row major order for continuity.
            return new Matrix4x4(
                (x2 * oneMinusC) + c,
                (xy * oneMinusC) - zs,
                (xz * oneMinusC) + ys,
                0.0,
                
                (xy * oneMinusC) + zs,
                (y2 * oneMinusC) + c,
                (yz * oneMinusC) - xs,
                0.0,

                (xz * oneMinusC) - ys,
                (yz * oneMinusC) + xs,
                (z2 * oneMinusC) + c,
                0.0,

                0.0,
                0.0,
                0.0,
                1.0
            );
    };
    
     getOrthoMatrix = function (left, right, bottom, top, zNear, zFar) {
            var width = right - left,
                height = top - bottom,
                depth = zFar - zNear;

            return new Matrix4x4(
                2.0 / width,
                0.0,
                0.0,
                -(right + left) / width,

                0.0,
                2.0 / height,
                0.0, 
                -(top + bottom) / height,
                
                0.0,
                0.0,
                -2.0 / depth,
                -(zFar + zNear) / depth,
            
                0.0,
                0.0,
                0.0,
                1.0
            );
        };

    return matrix4x4;
})();
