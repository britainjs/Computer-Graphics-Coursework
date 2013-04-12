/*
 * Unit tests for our matrix4x4 object.
 */
$(function () {

    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {
        var m = new Matrix4x4();

        // JD: For the matrices with larger numbers, I'd say there's not that
        //     huge a need to force that 4x4 look.  Just indent as normal.
        deepEqual(m.elements, [1, 0, 0, 0,
                               0, 1, 0, 0,
                               0, 0, 1, 0,
                               0, 0, 0, 1], "All elements of the default matrix");
        deepEqual(m.elements[0], 1, "First element by index.");
        deepEqual(m.elements[4], 0, "Fifth element by index.");
        deepEqual(m.elements[10], 1, "11th element by index.");
        deepEqual(m.elements[15], 1, "Last element by index.");
        m = new Matrix4x4(1, 2, 3, 4,
                          5, 6, 7, 8,
                          9, 10, 11, 12,
                          13, 14, 15, 16);             
        deepEqual(m.elements, [1, 2, 3, 4,
                               5, 6, 7, 8,
                               9, 10, 11, 12,
                               13, 14, 15, 16], "All elements of an initialized matrix");
        deepEqual(m.elements[0], 1, "First element by index");
        deepEqual(m.elements[5], 6, "Sixth element by index");
        deepEqual(m.elements[11], 12, "Twelfth element by index");
        deepEqual(m.elements[15], 16, "Last element by index");

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
                                     220, 90, 379, 167], "Matrix multiplication");
        mresult = m.multiply(o);
        deepEqual(mresult.elements, [0, 4, 5, 1,
                            1, 2, 3, 6,
                            10, 4, 0, 8,
                            15, 2, 1, 1], "Matrix Multiplication by Identity Matrix");
        mresult = m.multiply(m);
        deepEqual(mresult.elements, [69, 30, 13, 65,
                                     122, 32, 17, 43,
                                     124, 64, 70, 42,
                                     27, 70, 82, 36], "Matrix multiplication using identical matrices.");
    });

    test("Translate", function () {
        // JD: What you have below should be:
        //
        //         var m1 = Matrix4x4.getTranslationMatrix(5, 7, 9);
        //
        //     Ditto for the other functions.
        var m1 = Matrix4x4.getTranslationMatrix(5, 7, 9);
        deepEqual(m1.elements, [1, 0, 0, 5,
                                0, 1, 0, 7,
                                0, 0, 1, 9,
                                0, 0, 0, 1], "Translate x by 5, y by 7, and z by 9");      
        m1 = Matrix4x4.getTranslationMatrix(0, 0, 4);
        deepEqual(m1.elements, [1, 0, 0, 0,
                                0, 1, 0, 0,
                                0, 0, 1, 4,
                                0, 0, 0, 1], "Translate z by 4.");
        m1 = Matrix4x4.getTranslationMatrix(-5, 0.011, -0.53);
        deepEqual(m1.elements, [1, 0, 0, -5,
                                0, 1, 0, 0.011,
                                0, 0, 1, -0.53,
                                0, 0, 0, 1], "Translate x by -5, y by 0.011, and z by -0.53");
        var m2 = new Matrix4x4();
        m1 = Matrix4x4.getTranslationMatrix(0, 0, 0);
        deepEqual(m1, m2, "Translate by 0, 0, 0 yields the identity matrix.");
    });

    test("Scale", function () {
        var mscale = Matrix4x4.getScaleMatrix(0.5, 0.5, 0.5);
        deepEqual(mscale.elements, [0.5, 0, 0, 0,
                           0, 0.5, 0, 0,
                           0, 0, 0.5, 0,
                           0, 0, 0, 1], "Scale by 0.5 on all axis.");
        mscale = Matrix4x4.getScaleMatrix(2, 1, 1);
        deepEqual(mscale.elements, [2, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           0, 0, 0, 1], "Scale x value by 2.");
        mscale = Matrix4x4.getScaleMatrix(5, 3, 2);
        deepEqual(mscale.elements, [5, 0, 0, 0,
                           0, 3, 0, 0,
                           0, 0, 2, 0,
                           0, 0, 0, 1], "Scale by (5, 3, 2).");
        // Scaling works by multiplication, so a scale factor  of >= 0 is nonsensical.
        raises(
            function () {
                return Matrix4x4.getScaleMatrix(0, 5, 3);
            },
            "Check for a scale factor of 0."
        );
        raises(
            function () {
                return Matrix4x4.getScaleMatrix(2, 3, -1);
            },
            "Check for a negative scale factor."
        );
    });
    test("Rotation", function () {
        var m = Matrix4x4.getRotationMatrix(45, 1, 0, 0);
        deepEqual(m.elements, [1, 0, 0, 0,
                      0, 0.7071067811865476, -0.7071067811865475, 0,
                      0, 0.7071067811865475, 0.7071067811865476, 0,
                      0, 0, 0, 1], "Rotate about x-axis by 45.");
        m = Matrix4x4.getRotationMatrix(0, 0, 0, 1);
        deepEqual(m.elements, [1, 0, 0, 0,
                               0, 1, 0, 0,
                               0, 0, 1, 0,
                               0, 0, 0, 1], "Rotate by 0 around the z axis.");
        m = Matrix4x4.getRotationMatrix(180, 0, 1, 0);
        var radians = 180 * (Math.PI / 180);
        deepEqual(m.elements, [Math.cos(radians), 0, Math.sin(radians), 0,
                                0, 1, 0, 0,
                                -Math.sin(radians), 0, Math.cos(radians), 0,
                                0, 0, 0, 1], "Rotate by 180 degrees around the y-axis.");
        m = Matrix4x4.getRotationMatrix(30, 0, 0, 1);
        radians = 30 * (Math.PI / 180);
        deepEqual(m.elements, [Math.cos(radians), -Math.sin(radians), 0, 0,
                               Math.sin(radians), Math.cos(radians), 0, 0,
                               0, 0, 1, 0,
                               0, 0, 0, 1], "Rotate by 30 degrees around the z axis.");
    });

    test("Projection", function () {
        //Test Ortho Matrix
        var m = Matrix4x4.getOrthoMatrix(-1, 1, -1, 1, -1, 1);
        // JD: These are elementary enough that you can write out the answer
        //     instead of using expressions.
        deepEqual(m.elements, [2/(1 - -1), 0, 0, -((1 + -1)/(1 - -1)),
                               0, 2/(1 - (-1)), 0, -((1 + -1)/(1 - -1)),
                               0, 0, (-2)/(1 - -1), -((1 + -1)/(1 - -1)),
                               0, 0, 0, 1], 
                               "Project onto a surface with left -1, right 1, bottom -1, top 1, near -1, and far 1."
        );
        m = Matrix4x4.getOrthoMatrix(-5, 3, 0, 4, -3, 0);
        // JD: Same here---you can go all the way up to the fraction I'd say.
        deepEqual(m.elements, [2/(3 - -5), 0, 0, -((3 + -5)/(3 - -5)),
                               0, 2/(4 - 0), 0, -((4 + 0)/(4 - 0)),
                               0, 0, (-2)/(0 - -3), -((0 + -3)/(0 - -3)),
                               0, 0, 0, 1], 
                               "Project onto a surface of left -5, right 3, bottom 0, top 4, near -3, and far 0."
        );
        //Test Frustum Matrix
        m = Matrix4x4.getFrustumMatrix(10, 20, 15, 100, 0, 6);
        // JD: Now this one does have a cell that deserves to be written as an
        //     expression---but ironically it's the one written as a literal!
        deepEqual(m.elements, [0, 0, 3, 0,
                               0, 0, 1.3529411764705883, 0,
                               0, 0, -1, 0,
                               0, 0, -1, 0], 
                               "Perspective projection to left 10, right 20, bottom 15, top 100, near 0, far 6."
        );
        m = Matrix4x4.getFrustumMatrix(-100, 100, -100, 100, -100, 100);
        deepEqual(m.elements, [-1, 0, 0, 0,
                               0, -1, 0, 0,
                               0, 0, 0, 100,
                               0, 0, -1, 0],
                               "Perspective projection to left -100, right 100, bottom -100, top 100, near -100, far 100."
        );      
    });

    // JD: TODO camera matrix unit test(s)!

    test("Convenience and Conversion", function () {
        //Test conversion to column major
        var m = new Matrix4x4(1, 2, 3, 4,
                              5, 6, 7, 8,
                              9, 10, 11, 12,
                              13, 14, 15, 16);
        m = m.toColumnMajor();
        deepEqual(m.elements, [1, 5, 9, 13,
                               2, 6, 10, 14,
                               3, 7, 11, 15,
                               4, 8, 12, 16], "Test conversion to column major ordering."
        );
        m = new Matrix4x4();
        m = m.toColumnMajor();
        deepEqual(m.elements, [1, 0, 0, 0,
                               0, 1, 0, 0,
                               0, 0, 1, 0,
                               0, 0, 0, 1], 
                               "Identity Matrix converted to column major is unchanged."
        );
        m = new Matrix4x4(14, 51, 12, 0,
                          -1, -3, 5, 23,
                          145, 5, 6, 0,
                          435, -1345, 554, 3);
       m =  m.toColumnMajor();
        deepEqual(m.elements, [14, -1, 145, 435,
                               51, -3, 5, -1345,
                               12, 5, 6, 554,
                               0, 23, 0, 3],
                               "Conversion to column major ordering.");                         
    });

});
