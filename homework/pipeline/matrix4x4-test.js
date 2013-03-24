/*
 * Unit tests for our matrix4x4 object.
 */
$(function () {

    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {
        var m = new Matrix4x4();


        deepEqual(m.elements, [1, 0, 0, 0,
                               0, 1, 0, 0,
                               0, 0, 1, 0,
                               0, 0, 0, 1], "All elements of the default matrix");
        deepEqual(m.elements[0], 1, "First element by index.");
        deepEqual(m.elements[4], 0, "Fifth element by index.");
        deepEqual(m.elements[10], 1, "11th element by index.");
        deepEqual(m.elements[15], 1, "Last element by index.");
        
        var n = new Matrix4x4(1, 2, 3, 4,
                               5, 6, 7, 8,
                               9, 10, 11, 12,
                               13, 14, 15, 16);
                               
        deepEqual(n.elements, [1, 2, 3, 4,
                               5, 6, 7, 8,
                               9, 10, 11, 12,
                               13, 14, 15, 16], "All elements of an initialized matrix");
        deepEqual(n.elements[0], 1, "First element by index");
        deepEqual(n.elements[5], 6, "Sixth element by index");
        deepEqual(n.elements[11], 12, "Twelfth element by index");
        deepEqual(n.elements[15], 16, "Last element by index");

        m = new Matrix4x4(0, 0, 0, 0,
                           0, 0, 0, 0,
                           0, 0, 0, 0,
                           0, 0, 0, 0);

        deepEqual(m.elements, [0, 0, 0, 0,
                               0, 0, 0, 0,
                               0, 0, 0, 0,
                               0, 0, 0, 0], "All elements of a matrix of 0s");
        deepEqual(m.elements[0], 0, "First element by index");
        deepEqual(m.elements[1], 0, "Second element by index");
        deepEqual(m.elements[3], 0, "Fourth element by index");
        deepEqual(m.elements[7], 0, "Eighth element by index");
        deepEqual(m.elements[12], 0, "Thirteenth element by index");
        
    });

    test("Multiplication", function () {
        var m = new Matrix4x4(0, 4, 5, 1,
                              1, 2, 3, 6,
                              10, 4, 0, 8,
                              15, 2, 1, 1),
            n = new Matrix4x4(14, 4, 22, 10,
                              0, 11, 14, 5,
                              1, 6, 13, 7,
                              9, 2, 8, 0),
            o = new Matrix4x4(),
            mresult = m.multiply(n);

        deepEqual(mresult.elements, [14, 76, 129, 55,
                                     71, 56, 137, 41,
                                     212, 100, 340, 120,
                                     220, 90, 379, 167]  , "Matrix multiplication");
        
        mresult = m.multiply(o);
        deepEqual(mresult.elements, [0, 4, 5, 1,
                            1, 2, 3, 6,
                            10, 4, 0, 8,
                            15, 2, 1, 1], "Matrix Multiplication by Identity Matrix");
                            
        mresult = m.multiply(m);
        deepEqual(mresut.elements, [69, 30, 13, 65,
                                    122, 32, 17, 43,
                                    124, 64, 70, 42,
                                    27, 70, 82, 36], 
                                    "Matrix multiplication using identical matrices.");
    });

    test("Dot Product", function () {
        var v1 = new Vector(-5, -2),
            v2 = new Vector(-3, 4);

        equal(v1.dot(v2), 7, "2D dot product");

        // Try for a perpendicular.
        v1 = new Vector(Math.sqrt(2) / 2, Math.sqrt(2) / 2);
        v2 = new Vector(-Math.sqrt(2) / 2, Math.sqrt(2) / 2);
        equal(v1.dot(v2), 0, "Perpendicular 2D dot product");

        // Try 3D.
        v1 = new Vector(3, 2, 5);
        v2 = new Vector(4, -1, 3);
        equal(v1.dot(v2), 25, "3D dot product");

        // Check for errors.
        v1 = new Vector(4, 2);
        v2 = new Vector(3, 9, 1);

        // We can actually check for a *specific* exception, but
        // we won't go that far for now.
        raises(
            function () {
                return v1.dot(v2);
            },
            "Check for vectors of different sizes"
        );
    });

    test("Cross Product", function () {
        var v1 = new Vector(3, 4),
            v2 = new Vector(1, 2),
            vresult;

        // The cross product is restricted to 3D, so we start
        // with an error check.
        raises(
            function () {
                return v1.cross(v2);
            },
            "Check for non-3D vectors"
        );

        // Yeah, this is a bit of a trivial case.  But it at least
        // establishes the right-handedness of a cross-product.
        v1 = new Vector(1, 0, 0);
        v2 = new Vector(0, 1, 0);
        vresult = v1.cross(v2);

        equal(vresult.x(), 0, "Cross product first element");
        equal(vresult.y(), 0, "Cross product second element");
        equal(vresult.z(), 1, "Cross product third element");

        // This one shows that switching vector order produces
        // the opposite-pointing normal.
        vresult = v2.cross(v1);

        equal(vresult.x(), 0, "Cross product first element");
        equal(vresult.y(), 0, "Cross product second element");
        equal(vresult.z(), -1, "Cross product third element");
    });

    test("Magnitude and Unit Vectors", function () {
        var v = new Vector(3, 4);

        // The classic example.
        equal(v.magnitude(), 5, "2D magnitude check");

        // Kind of a cheat, but still tests the third dimension.
        v = new Vector(5, 0, 12);
        equal(v.magnitude(), 13, "3D magnitude check");

        // Now for unit vectors.
        v = (new Vector(3, 4)).unit();

        equal(v.magnitude(), 1, "2D unit vector check");
        equal(v.x(), 3 / 5, "2D unit vector first element");
        equal(v.y(), 4 / 5, "2D unit vector second element");

        v = (new Vector(0, -7, 24)).unit();

        equal(v.magnitude(), 1, "3D unit vector check");
        equal(v.x(), 0, "3D unit vector first element");
        equal(v.y(), -7 / 25, "3D unit vector second element");
        equal(v.z(), 24 / 25, "3D unit vector third element");
    });

    test("Projection", function () {
        var v = new Vector(3, 3, 0),
            vresult = v.projection(new Vector(5, 0, 0));

        equal(vresult.magnitude(), 3, "3D vector projection magnitude check");
        equal(vresult.x(), 3, "3D vector projection first element");
        equal(vresult.y(), 0, "3D vector projection second element");
        equal(vresult.z(), 0, "3D vector projection third element");

        // Error check: projection only applies to vectors with the same
        // number of dimensions.
        raises(
            function () {
                (new Vector(5, 2)).projection(new Vector(9, 8, 1));
            },
            "Ensure that projection applies only to vectors with the same number of dimensions"
        );
    });

});
