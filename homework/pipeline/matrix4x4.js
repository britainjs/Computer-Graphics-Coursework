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
    
    matrix4x4.prototype.toColumnMajor = function () {
        var result = new Matrix4x4(),
            i,
            j,
            index = 0;
            
        for (i = 0; i < 4; i += 1) {
            for (j = i; j < 16; j += 4) {
                result.elements[index] = this.elements[j];
                index += 1
            }        
        }
        
        return result;
    },
    
    //Translation. Shifts the point in space by the given x, y, and z coordinate.
    matrix4x4.getTranslationMatrix = function (dx, dy, dz) {
        return new matrix4x4(1, 0, 0, dx,
                             0, 1, 0, dy,
                             0, 0, 1, dz,
                             0, 0, 0, 1);
    };
    
    //Scale
    matrix4x4.getScaleMatrix = function (sx, sy, sz) {
        if ( (sx <= 0) || (sy <= 0) || (sz <= 0) ) {
            throw "Scale factor must be greater than 0.";
        }
        return new matrix4x4(sx, 0, 0, 0,
                             0, sy, 0, 0,
                             0, 0, sz, 0,
                             0, 0, 0, 1);
    };
    
    matrix4x4.getRotationMatrix = function (angle, x, y, z) {
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
    
     matrix4x4.getOrthoMatrix = function (left, right, bottom, top, zNear, zFar) {
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
        
        matrix4x4.getFrustumMatrix = function (left, right, bottom, top, zNear, zFar) {
            var n2 = 2 * zNear,
                width = right - left,
                height = top - bottom,
                depth = zFar - zNear;
                
            return new Matrix4x4(
                n2 / width,
                0.0,
                (right + left) / width,
                0.0,
                
                0.0,
                n2 / height,
                (top + bottom) / height,
                0.0,
                
                0.0,
                0.0,
                -(zFar + zNear) / depth,
                (-n2 * zFar) / depth,
                
                0.0,
                0.0,
                -1.0,
                0.0
            );
        };
        
        //A catch-all transform.
        // JD: Nice, but you should probably document the properties
        //     that you expect object to have.  And probably rename it
        //     to something more indicative of what it is, like
        //     "transformParameters" or something like that.
        matrix4x4.instanceTransform = function (object) {
            // JD: Yikes, this can use some reformatting.
            return matrix4x4.getTranslationMatrix(object.dx || 0, object.dy || 0, object.dz || 0).multiply(
                matrix4x4.getScaleMatrix(object.sx || 1, object.sy || 1, object.sz || 1).multiply(
                    matrix4x4.getRotationMatrix(object.angle || 0, object.x || 0, object.y || 0, object.z || 0))).toColumnMajor();
        };
        
        // The camera transform.
        matrix4x4.getLookAtMatrix = function (p, q, up) {
            var ze = (p.subtract(q)).unit(),
                ye = (up.subtract(up.projection(ze))).unit(),
                xe = ye.cross(ze);
                console.log(ze);
                console.log(ye);
                console.log(xe);
            return new Matrix4x4(
                xe.x(), xe.y(), xe.z(), -(p.dot(xe)),
                ye.x(), ye.y(), ye.z(), -(p.dot(ye)),
                ze.x(), ze.y(), ze.z(), -(p.dot(ze)),
                0, 0, 0, 1
            );
        };

    return matrix4x4;
})();
