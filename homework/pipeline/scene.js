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
        currentOrbit = 0.0,
        currentDX,
        currentDY = 0,
        up = true,
        transformMatrix,
        cameraMatrix,
        projectionMatrix,
        vertexPosition,
        vertexColor,
        normalVector,
        lightPosition,
        lightDiffuse,
        
        //Shape variables
        obelisk = Shapes.tetrahedron(),
        sun = Shapes.sphere(30, 30, 1),
        ground = [].concat(
            [1.0, -0.5, -1.0],
            [1.0, -1.0, 1.0],
            [-1.0, -1.0, 1.0],
            [-1.0, -0.5, -1.0]
        ),
        sky = Shapes.sphere(10, 10, 10),
        orbLarge = Shapes.sphere(10, 10, 0.15),
        orbSmall = Shapes.sphere(30, 30, 0.07),
        
        
        // Lighting variables.
        normalVector,
        lightPosition,
        lightDiffuse,

        // Scene state variables.
        sceneState = {
            orbitSpeed: 0.0,
            orbitDirection: 1.0
        },
        sunOffset = -1.0,
 
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
        maxk,
        

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
        
        //A tetrahedron
        {
            color: {r: 1.0, g: 1.0, b: 1.0},
            vertices: Shapes.toRawTriangleArray(obelisk),
            mode: gl.TRIANGLES,
            // JD: See the object below for the preferred indentation...
            transform: {
                dy:- 1.2,
                sx: 0.5,
                sy: 1,
                sz: 0.5,
                angle: 180,
                x: 0,
                y: 1,
                z: 0
             },
             normals: Shapes.toNormalArray(obelisk)
        },
        
        // The sun.
        {   
            color: {r: 0.0, g:0.5, b:0.5},
            vertices: Shapes.toRawTriangleArray(sun),
            mode: gl.TRIANGLES,
            // JD: Preferred formatting is as follows (compare to above):
            transform: {
                dx: -0.5,
                dz: 1.0,
                sx: 0.25,
                sy: 0.25,
                sz: 0.25,
                angle: currentRotation,
                x: 0,
                y: 1,
                z: 0
            },
            normals: Shapes.toNormalArray(sun)
        },
        
        //The ground
        {
            color: {r: 0.5, g: 0.2, b: 0.0},
            vertices: ground,
            mode: gl.TRIANGLE_FAN,
            transform: {
                dy: 4,
                sx: 10,
                sy: 10,
                x: 1
            },
            normals: [].concat(
                [1.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [1.0, 0.0, 0.0]
            )
        },
        
        //the sky
        // JD: As you can see, you may need to expand this now---maybe even
        //     make it a cylinder or a dome!
        {
            color: {r: 0.7, g: 0.0, b: 0.5},
            vertices: Shapes.toRawTriangleArray(sky),
            mode: gl.TRIANGLES,
            transform: {x: 1},
            normals: Shapes.toNormalArray(sky)
        },
        
        {
            shapes: [
                {
                    color: {r: 1.0, g: 1.0, b: 1.0},
                    vertices: Shapes.toRawTriangleArray(orbLarge),
                    mode: gl.LINE_LOOP,
                    transform: {
                        dy: 1.4,
                        angle: 0,
                        y: 1
                    },
                    normals: Shapes.toNormalArray(orbLarge)
                },
                
                {
                    color: {r: 1.0, g: 1.0, b: 1.0},
                    vertices: Shapes.toRawTriangleArray(orbSmall),
                    mode: gl.LINE_LOOP,
                    transform: {
                        dy: 1.4,
                        angle: 0,
                        y: 1
                    },
                    normals: Shapes.toNormalArray(orbSmall)
                }           
            ]
        }
            
        
        
    ];

    // Pass the vertices to WebGL.
    for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
        // JD: Note that this goes to only one level of children.  Ideally your
        //     object composition can go arbitrarily deep.
        //
        //     The other red flag that should be raised here is that you have
        //     two fairly large chunks of nearly identical code.  This can be
        //     unified (while also solving the only-one-level-of-children
        //     limitation!).
        if (objectsToDraw[i].shapes) {
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
            // JD: Bad indent here.
                objectsToDraw[i].shapes[j].colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                        objectsToDraw[i].shapes[j].colors);
                objectsToDraw[i].shapes[j].normalBuffer = GLSLUtilities.initVertexBuffer(gl,
                objectsToDraw[i].shapes[j].normals);
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
            objectsToDraw[i].normalBuffer = GLSLUtilities.initVertexBuffer(gl,
                objectsToDraw[i].normals);
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
    normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);
    
    transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");
    projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    
    lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");


    /*
     * Displays an individual object or a composite object. A composite object is
     * marked with a composite property (a boolean), and contains multiple component
     * objects, each of which is a shape object with its own vertices and indices, etc.
     * The composite object drawing function is not working correctly as of right now,
     * so it has been commented out.
     */
    // JD: OK, missing composite functionality noted.

    // JD 0409: Composite functionality v1.0 seen, but can be improved (see
    //     earlier inline comment---that applies here also).
    drawObject = function (object, composite) {
        if(object.shapes) {
            for(i = 0; i < object.shapes.length; i++) {
                // Set the varying colors.
                gl.bindBuffer(gl.ARRAY_BUFFER, object.shapes[i].colorBuffer);
                gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

                // Set the varying vertex coordinates.
                gl.bindBuffer(gl.ARRAY_BUFFER, object.shapes[i].buffer);
                gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
                gl.drawArrays(object.shapes[i].mode, 0, object.shapes[i].vertices.length / 3);
                
                // Set the varying normal vectors.
                gl.bindBuffer(gl.ARRAY_BUFFER, object.shapes[i].normalBuffer);
                gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);
            }
        }else {
            // Set the varying colors.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
            gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

            // Set the varying vertex coordinates.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(object.mode, 0, object.vertices.length / 3);
            
            // Set the varying normal vectors.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
            gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);
        }
    };

    /*
     * Displays the scene.
     */
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(projectionMatrix, gl.FALSE, new Float32Array(Matrix4x4.getFrustumMatrix(-1, 1, -1, 1, 5, 100).toColumnMajor().elements));

    $(document).keydown(function (event) {
        if (event.which == 37) {
            sceneState.orbitDirection = 1.0;
        } else if (event.which == 39) {
            sceneState.orbitDirection = -1.0;
        } else if (event.which == 38) {
            sceneState.orbitSpeed += 0.01;
            event.preventDefault();
        } else if (event.which == 40) {
            sceneState.orbitSpeed -= 0.01;
            event.preventDefault();
        }

        if (sceneState.orbitSpeed < 0.0) {
            sceneState.orbitSpeed = 0.0;
        }
    });

    drawScene = function () {

        Animator.orbit([objectsToDraw[1]], currentOrbit, 2.0, 2.0, 0.0, sunOffset);
        Animator.hover([objectsToDraw[4].shapes[0], objectsToDraw[4].shapes[1]], currentDY, currentRotation);
        // Display the objects.
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            // JD: Composite note again.
            if (objectsToDraw[i].shapes){
                for (j = 0; j < objectsToDraw[i].shapes.length; j += 1) {
                    gl.uniformMatrix4fv(transformMatrix, gl.FALSE, new Float32Array(Matrix4x4.instanceTransform(objectsToDraw[i].shapes[j].transform).elements)); 
                    drawObject(objectsToDraw[i].shapes[j]);
                }
            }else{  
                gl.uniformMatrix4fv(transformMatrix, gl.FALSE, new Float32Array(Matrix4x4.instanceTransform(objectsToDraw[i].transform).elements));
                drawObject(objectsToDraw[i]);
            }
        }

        // All done.
        gl.flush();
    };

// JD: Ack!  I can't believe I didn't indent this right.  Sorry.
//     But I think I intentionally did this as a one-off, and
//     that's why I let it stick out.  Yeah, that's right.
//     That's the reason  ;-)
gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, new Float32Array(
    Matrix4x4.getLookAtMatrix(
        new Vector(0, 0, -8),
        new Vector(0, 0, 10),
        new Vector(0, 1, 0)
    ).toColumnMajor().elements));

    // Start animating.  This scene is always animating.
    setInterval(function () {
        currentRotation += 1.0;

        if (up) {
            currentDY += 0.001;
            if (currentDY >= 0.05) {
                up = false;
            }
        } else {
            currentDY -= 0.001;
            if (currentDY <= -0.05) {
                up = true;
            }
        }

        currentOrbit += sceneState.orbitSpeed * sceneState.orbitDirection;
        if (currentOrbit >= Math.PI * 2) {
            currentOrbit -= Math.PI * 2;
        }

        drawScene();
        if (currentRotation >= 360.0) {
            currentRotation -= 360.0;
            
        }
    }, 5);

}(document.getElementById("scene")));
