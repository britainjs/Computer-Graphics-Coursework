/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
(function (canvas) {

    // Because many of these variables are best initialized then immediately
    // used in context, we merely name them here.  Read on to see how they
    // are used.
    var gl, // The WebGL context.

        // This variable stores 3D model information.
        objectsToDraw,

        // The shader program to use.
        shaderProgram,

        // Utility variable indicating whether some fatal has occurred.
        abort = false,

        // Important state variables.
        currentRotation = 0.0,
        currentInterval,
        transformMatrix,
        vertexPosition,
        vertexColor,

        // An individual "draw object" function.
        drawObject,

        // The big "draw scene" function.
        drawScene,

        // Reusable loop variables.
        i,
        maxi,
        j,
        maxj,
        k,
        maxk;

    // Grab the WebGL rendering context.
    gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Build the objects to display.
    objectsToDraw = [
       /* {
            vertices: [].concat(
                [ 0.0, 0.0, 0.0 ],
                [ 0.5, 0.0, -0.75 ],
                [ 0.0, 0.5, 0.0 ]
            ),
            colors: [].concat(
                [ 1.0, 0.0, 0.0 ],
                [ 0.0, 1.0, 0.0 ],
                [ 0.0, 0.0, 1.0 ]
            ),
            mode: gl.TRIANGLES
        },

        {
            color: { r: 0.0, g: 1.0, b: 0 },
            vertices: [].concat(
                [ 0.25, 0.0, -0.5 ],
                [ 0.75, 0.0, -0.5 ],
                [ 0.25, 0.5, -0.5 ]
            ),
            mode: gl.TRIANGLES
        },

        {
            color: { r: 0.0, g: 0.0, b: 1.0 },
            vertices: [].concat(
                [ -0.25, 0.0, 0.5 ],
                [ 0.5, 0.0, 0.5 ],
                [ -0.25, 0.5, 0.5 ]
            ),
            mode: gl.TRIANGLES
        }, 

        {
            color: { r: 0.0, g: 0.0, b: 1.0 },
            vertices: [].concat(
                [ -1.0, -1.0, 0.75 ],
                [ -1.0, -0.1, -1.0 ],
                [ -0.1, -0.1, -1.0 ],
                [ -0.1, -1.0, 0.75 ]
            ),
            mode: gl.LINE_LOOP
        },*/
        // I have not implemented (or figured out) transforms yet, so comment out the 
        // shapes you do not wish displayed.
        
        //A blade shape
        // JD: Watch your winding here.
        /*{   
            color: { r: 0.0, g: 0.5, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.blade()),
            mode: gl.TRIANGLES
        },*/
        
        //A tetrahedron
        {
            color: {r: 1.0, g: 1.0, b: 1.0},
            vertices: Shapes.toRawTriangleArray(Shapes.tetrahedron()),
            mode: gl.TRIANGLES,
            transform: Matrix4x4.instanceTransform(0, -0.5, 0, 0.5, 0.5, 0.5, currentRotation, 0, 1, 0).elements
        },
        
        //A sphere. Will currently display with a hole at the end
        // JD: Actually, based on the TRIANGLES rendering, there are quite
        //     a few holes!
        {   
            color: {r: 0.0, g:0.5, b:0.5},
            vertices: Shapes.toRawTriangleArray(Shapes.sphere(30, 30, 1)),
            mode: gl.TRIANGLES,
            transform: Matrix4x4.instanceTransform(-0.5, 0.5, 0, 0.25, 0.25 ,0.25, currentRotation, 0, 1, 0).elements
        }
            
        
        
    ];

    // Pass the vertices to WebGL.
    for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
        if (objectsToDraw[i].composite) {
            for (j = 0; j < objectsToDraw[i].shapes.length; j++) {
                 objectsToDraw[i].shapes[j].buffer = GLSLUtilities.initVertexBuffer(gl,
                    objectsToDraw[i].shapes[j].vertices);
                if (!objectsToDraw[i].shapes[j].colors) {
                    // If we have a single color, we expand that into an array
                    // of the same color over and over.
                    objectsToDraw[i].shapes[j].colors = [];
                    for (k = 0, maxk = objectsToDraw[i].shapes[j].vertices.length / 3;
                            k < maxk; k += 1) {
                        objectsToDraw[i].shapes[j].colors = objectsToDraw[i].shapes[j].colors.concat(
                            objectsToDraw[i].shapes[j].color.r,
                            objectsToDraw[i].shapes[j].color.g,
                            objectsToDraw[i].shapes[j].color.b
                        );
                    }
                }
            objectsToDraw[i].shapes[j].colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                    objectsToDraw[i].shapes[j].colors);
            
            }
            
            
        } else {
            objectsToDraw[i].buffer = GLSLUtilities.initVertexBuffer(gl,
                    objectsToDraw[i].vertices);
            if (!objectsToDraw[i].colors) {
                // If we have a single color, we expand that into an array
                // of the same color over and over.
                objectsToDraw[i].colors = [];
                for (j = 0, maxj = objectsToDraw[i].vertices.length / 3;
                        j < maxj; j += 1) {
                    objectsToDraw[i].colors = objectsToDraw[i].colors.concat(
                        objectsToDraw[i].color.r,
                        objectsToDraw[i].color.g,
                        objectsToDraw[i].color.b
                    );
                }
            }
            objectsToDraw[i].colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                    objectsToDraw[i].colors);
        }
        
        
    }

    // Initialize the shaders.
    shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        function (shader) {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        function (shaderProgram) {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);
    


    vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(vertexColor);
    transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
   // };


    /*
     * Displays an individual object or a composite object. A composite object is
     * marked with a composite property (a boolean), and contains multiple component
     * objects, each of which is a shape object with its own vertices and indices, etc.
     * The composite object drawing function is not working correctly as of right now,
     * so it has been commented out.
     */
    // JD: OK, missing composite functionality noted.
    drawObject = function (object, composite) {
        if(object.composite) {
            for(i = 0; i < object.shapes.length; i++) {
                // Set the varying colors.
                gl.bindBuffer(gl.ARRAY_BUFFER, object.shapes[i].colorBuffer);
                gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

                // Set the varying vertex coordinates.
                gl.bindBuffer(gl.ARRAY_BUFFER, object.shapes[i].buffer);
                gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
                gl.drawArrays(object.shapes[i].mode, 0, object.shapes[i].vertices.length / 3);
            }
        }else {
            // Set the varying colors.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
            gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

            // Set the varying vertex coordinates.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(object.mode, 0, object.vertices.length / 3);
        }
    };

    /*
     * Displays the scene.
     */
    drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        
        // Display the objects.
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            gl.uniformMatrix4fv(transformMatrix, gl.FALSE, new Float32Array(objectsToDraw[i].transform));
            drawObject(objectsToDraw[i]);
        }

        // All done.
        gl.flush();
    };

    // Draw the initial scene.
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
    $(canvas).click(function () {
        if (currentInterval) {
            clearInterval(currentInterval);
            currentInterval = null;
        } else {
            currentInterval = setInterval(function () {
                currentRotation += 1.0;
                drawScene();
                if (currentRotation >= 360.0) {
                    currentRotation -= 360.0;
                    
                }
            }, 30);
        }
    });

}(document.getElementById("scene")));
