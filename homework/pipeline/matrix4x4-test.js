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
        deepEqual(mresult.elements, [69, 30, 13, 65,
                                    122, 32, 17, 43,
                                    124, 64, 70, 42,
                                    27, 70, 82, 36], 
                                    "Matrix multiplication using identical matrices.");
    });

    test("Translate", function () {
        var m1 = getTranslationMatrix(5, 7, 9);

        deepEqual(m1.elements, [1, 0, 0, 5,
                                0, 1, 0, 7,
                                0, 0, 1, 9,
                                0, 0, 0, 1], "Translate x by 5, y by 7, and z by 9");
                                
        m1 = getTranslationMatrix(0, 0, 4);
        
        deepEqual(m1.elements, [1, 0, 0, 0,
                                0, 1, 0, 0,
                                0, 0, 1, 4,
                                0, 0, 0, 1], "Translate z by 4.");
        
        m1 = getTranslationMatrix(-5, 0.011, -0.53);
        
        deepEqual(m1.elements, [1, 0, 0, -5,
                                0, 1, 0, 0.011,
                                0, 0, 1, -0.53,
                                0, 0, 0, 1], 
                                "Translate x by -5, y by 0.011, and z by -0.53");
        var m2 = new Matrix4x4();
        m1 = getTranslationMatrix(0, 0, 0);
        
        deepEqual(m1, m2, "Translate by 0, 0, 0 yields the identity matrix.");
                                            
                                


    });

    test("Scale", function () {
        var mscale = getScaleMatrix(0.5, 0.5, 0.5);
        
        deepEqual(mscale.elements, [0.5, 0, 0, 0,
                           0, 0.5, 0, 0,
                           0, 0, 0.5, 0,
                           0, 0, 0, 1], "Scale by 0.5 on all axis.");
        
        mscale = getScaleMatrix(2, 1, 1);
        
        deepEqual(mscale.elements, [2, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           0, 0, 0, 1], "Scale x value by 2.");
        
        mscale = getScaleMatrix(5, 3, 2);
        
        deepEqual(mscale.elements, [5, 0, 0, 0,
                           0, 3, 0, 0,
                           0, 0, 2, 0,
                           0, 0, 0, 1], "Scale by (5, 3, 2).");

        // Scaling works by multiplication, so a scale factor  of >= 0 is nonsensical.
        raises(
            function () {
                return getScaleMatrix(0, 5, 3);
            },
            "Check for a scale factor of 0."
        );
        
        raises(
            function () {
                return getScaleMatrix(2, 3, -1);
            },
            "Check for a negative scale factor."
        );
    });

    test("Rotation", function () {
        var m = getRotationMatrix(45, 1, 0, 0);
        
        deepEqual(m.elements, [1, 0, 0, 0,
                      0, 0.7071067811865476, -0.7071067811865475, 0,
                      0, 0.7071067811865475, 0.7071067811865476, 0,
                      0, 0, 0, 1], "Rotate about x-axis by 45.");
        
        m = getRotationMatrix(0, 0, 0, 1);
        
        deepEqual(m.elements, [1, 0, 0, 0,
                               0, 1, 0, 0,
                               0, 0, 1, 0,
                               0, 0, 0, 1], "Rotate by 0 around the z axis.");
        
        m = getRotationMatrix(180, 0, 1, 0);
        
        deepEqual(m.elements, [-1, 0, 1.2246063538223773e-16, 0,
                                0, 1, 0, 0,
                                -1.2246063538223773e-16, 0, -1, 0,
                                0, 0, 0, 1], "Rotate by 180 degrees around the y-axis.");
        
        m = getRotationMatrix(30, 0, 0, 1);
        
        deepEqual(m.elements, [0.8660254037844387, -0.49999999999999994, 0, 0,
                               0.49999999999999994, 0.8660254037844387, 0, 0,
                               0, 0, 1, 0,
                               0, 0, 0, 1], "Rotate by 30 degrees around the z axis.");
    });

    test("Projection", function () {
        var m = getOrthoMatrix(-1, 1, -1, 1, -1, 1);
        
        deepEqual(m.elements, [2/(1 - -1), 0, 0, -((1 + -1)/(1 - -1)),
                               0, 2/(1 - (-1)), 0, -((1 + -1)/(1 - -1)),
                               0, 0, (-2)/(1 - -1), -((1 + -1)/(1 - -1)),
                               0, 0, 0, 1], 
                               "Project onto a surface with left -1, right 1, bottom -1, top 1, near -1, and far 1."
        );

        m = getOrthoMatrix(-5, 3, 0, 4, -3, 0);
        
        deepEqual(m.elements, [2/(3 - -5), 0, 0, -((3 + -5)/(3 - -5)),
                               0, 2/(4 - 0), 0, -((4 + 0)/(4 - 0)),
                               0, 0, (-2)/(0 - -3), -((0 + -3)/(0 - -3)),
                               0, 0, 0, 1], 
                               "Project onto a surface of left -5, right 3, bottom 0, top 4, near -3, and far 0."
        );
        
        m = getFrustumMatrix(10, 20, 15, 100, 0, 6);
        
        deepEqual(m.elements, [0, 0, 3, 0,
                               0, 0, 1.35294117647, 0,
                               0, 0, -1, 0,
                               0, 0, -1, 0], 
                               "Perspective projection to left 10, right 20, bottom 15, top 100, near 0, far 6."
        );
        
        m - getFrustumMatrix(-100, 100, -100, 100, -100, 100);
        
        deepEqual(m.elements, [-1, 0, 0, 0,
                               0, -1, 0, 0,
                               0, 0, 0, 100],
                               "Perspective projection to left -100, right 100, bottom -100, top 100, near -100, far 100."
        );      
    });

});
