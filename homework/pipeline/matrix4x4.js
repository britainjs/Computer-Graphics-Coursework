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
    }
    
    /*
    vector.prototype.subtract = function (v) {
        var result = new Vector(),
            i,
            max;

        // Dimensionality check.
        checkDimensions(this, v);

        for (i = 0, max = this.dimensions(); i < max; i += 1) {
            result.elements[i] = this.elements[i] - v.elements[i];
        }

        return result;
    };

    // Scalar multiplication and division.
    vector.prototype.multiply = function (s) {
        var result = new Vector(),
            i,
            max;

        for (i = 0, max = this.dimensions(); i < max; i += 1) {
            result.elements[i] = this.elements[i] * s;
        }

        return result;
    };

    vector.prototype.divide = function (s) {
        var result = new Vector(),
            i,
            max;

        for (i = 0, max = this.dimensions(); i < max; i += 1) {
            result.elements[i] = this.elements[i] / s;
        }

        return result;
    };

    // Dot product.
    vector.prototype.dot = function (v) {
        var result = 0,
            i,
            max;

        // Dimensionality check.
        checkDimensions(this, v);

        for (i = 0, max = this.dimensions(); i < max; i += 1) {
            result += this.elements[i] * v.elements[i];
        }

        return result;
    };

    // Cross product.
    vector.prototype.cross = function (v) {
        // This method is for 3D vectors only.
        if (this.dimensions() !== 3 || v.dimensions() !== 3) {
            throw "Cross product is for 3D vectors only.";
        }

        // With 3D vectors, we can just return the result directly.
        return new Vector(
            (this.y() * v.z()) - (this.z() * v.y()),
            (this.z() * v.x()) - (this.x() * v.z()),
            (this.x() * v.y()) - (this.y() * v.x())
        );
    };

    // Magnitude and unit vector.
    vector.prototype.magnitude = function () {
        // Make use of the dot product.
        return Math.sqrt(this.dot(this));
    };

    vector.prototype.unit = function () {
        // At this point, we can leverage our more "primitive" methods.
        return this.divide(this.magnitude());
    };

    // Projection.
    vector.prototype.projection = function (v) {
        var unitv;

        // Dimensionality check.
        checkDimensions(this, v);

        // Plug and chug :)
        // The projection of u onto v is u dot the unit vector of v
        // times the unit vector of v.
        unitv = v.unit();
        return unitv.multiply(this.dot(unitv));
    };
    */
    return matrix4x4;
})();
