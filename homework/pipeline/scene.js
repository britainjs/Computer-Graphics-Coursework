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
        vertexDiffuseColor,
        vertexSpecularColor,
        normalVector,
        lightPosition,
        lightDiffuse,
        
        //Shape variables
        obelisk = Shapes.tetrahedron(),
        sun = Shapes.sphere(30, 30, 1),
        ground = Shapes.cube(),
        sky = Shapes.sphere(10, 10, 10),
        orbLarge = Shapes.sphere(10, 10, 0.15),
        orbSmall = Shapes.sphere(30, 30, 0.07),
        
        
        // Lighting variables.
        normalVector,
        lightPosition,
        lightDiffuse,
        lightSpecular,

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
            transform: {
                dy:- 1.2,
                sx: 0.5,
                sy: 1,
                sz: 0.5,
                angle: 75,
                x: 0,
                y: 1,
                z: 0
             },
             normals: Shapes.toNormalArray(obelisk),
             specularColor: { r: 1.0, g: 1.0, b: 1.0 },
             shininess: 10,
             name: "obelisk"
        },
        
        // The sun.
        {   
            color: {r: 0.0, g:0.5, b:0.5},
            vertices: Shapes.toRawTriangleArray(sun),
            mode: gl.TRIANGLES,
            transform: {
                dx: -0.5,
                dz: 1.5,
                sx: 0.3,
                sy: 0.3,
                sz: 0.3,
                angle: currentRotation,
                x: 0,
                y: 1,
                z: 0
            },
            normals: Shapes.toNormalArray(sun),
            specularColor: { r: 1.0, g: 1.0, b: 1.0 },
            shininess: 1,
            name: "sun"
        },
        
        //The ground
        {
            color: {r: 0.5, g: 0.2, b: 0.0},
            vertices: Shapes.toRawTriangleArray(ground),
            mode: gl.TRIANGLES,
            transform: {
                dy: -1.5,
                dz: 0,
                sx: 100,
                sy: 1,
                sz: 100,
                x: 1
            },
            normals: [].concat(
                [ 0.0, 1.0, 0.0 ],
                [ 0.0, 1.0, 0.0 ],
                [ 0.0, 1.0, 0.0 ],
                [ 0.0, 1.0, 0.0 ],
                [ 0.0, 1.0, 0.0 ],
                [ 0.0, 1.0, 0.0 ],

                [ 0.0, 0.0, 1.0 ],
                [ 0.0, 0.0, 1.0 ],
                [ 0.0, 0.0, 1.0 ],
                [ 0.0, 0.0, 1.0 ],
                [ 0.0, 0.0, 1.0 ],
                [ 0.0, 0.0, 1.0 ],

                [ 1.0, 0.0, 0.0 ],
                [ 1.0, 0.0, 0.0 ],
                [ 1.0, 0.0, 0.0 ],
                [ 1.0, 0.0, 0.0 ],
                [ 1.0, 0.0, 0.0 ],
                [ 1.0, 0.0, 0.0 ],

                [ 0.0, 0.0, -1.0 ],
                [ 0.0, 0.0, -1.0 ],
                [ 0.0, 0.0, -1.0 ],
                [ 0.0, 0.0, -1.0 ],
                [ 0.0, 0.0, -1.0 ],
                [ 0.0, 0.0, -1.0 ],

                [ -1.0, 0.0, 0.0 ],
                [ -1.0, 0.0, 0.0 ],
                [ -1.0, 0.0, 0.0 ],
                [ -1.0, 0.0, 0.0 ],
                [ -1.0, 0.0, 0.0 ],
                [ -1.0, 0.0, 0.0 ],

                [ 0.0, -1.0, 0.0 ],
                [ 0.0, -1.0, 0.0 ],
                [ 0.0, -1.0, 0.0 ],
                [ 0.0, -1.0, 0.0 ],
                [ 0.0, -1.0, 0.0 ],
                [ 0.0, -1.0, 0.0 ]
            ),
            specularColor: { r: 1.0, g: 1.0, b: 1.0 },
            shininess: 1,
            name: "ground"
        },
        
        //the sky
        {
            color: {r: 0.7, g: 0.0, b: 0.5},
            vertices: Shapes.toRawTriangleArray(sky),
            mode: gl.TRIANGLES,
            transform: {x: 1},
            normals: Shapes.toNormalArray(sky),
            specularColor: { r: 1.0, g: 1.0, b: 1.0 },
            shininess: 1,
            name: "sky"
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
                    normals: Shapes.toNormalArray(orbLarge),
                    specularColor: { r: 1.0, g: 1.0, b: 1.0 },
                    shininess: 1,
                    name: "Large Orb"
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
                    normals: Shapes.toNormalArray(orbSmall),
                    specularColor: { r: 1.0, g: 1.0, b: 1.0 },
                    shininess: 1,
                    name: "Small Orb"
                }           
            ]
        }
    ];
    
        // Pass the vertices to WebGL.
        
        passVertices = function (objectToDraw) { 
            if (objectToDraw.shapes) {
            
                for (var l = 0; l < objectToDraw.shapes.length; l++) { 
                    passVertices(objectToDraw.shapes[l]);
                }
            } else {
                objectToDraw.buffer = GLSLUtilities.initVertexBuffer(gl,
                        objectToDraw.vertices);
                if (!objectToDraw.colors) {
                    // If we have a single color, we expand that into an array
                    // of the same color over and over.
                    objectToDraw.colors = [];
                    for (var j = 0, maxj = objectToDraw.vertices.length / 3;
                            j < maxj; j += 1) {
                        objectToDraw.colors = objectToDraw.colors.concat(
                            objectToDraw.color.r,
                            objectToDraw.color.g,
                            objectToDraw.color.b
                        );
                    }
                }
            
                objectToDraw.colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                        objectToDraw.colors);
                
                // Same trick with specular colors.
                if (!objectToDraw.specularColors) {
                    // Future refactor: helper function to convert a single value or
                    // array into an array of copies of itself.
                    objectToDraw.specularColors = [];
                    for (var j = 0, maxj = objectToDraw.vertices.length / 3;
                            j < maxj; j += 1) {
                        objectToDraw.specularColors = objectToDraw.specularColors.concat(
                            objectToDraw.specularColor.r,
                            objectToDraw.specularColor.g,
                            objectToDraw.specularColor.b
                        );
                    }
                }
                objectToDraw.specularBuffer = GLSLUtilities.initVertexBuffer(gl,
                    objectToDraw.specularColors);
                objectToDraw.normalBuffer = GLSLUtilities.initVertexBuffer(gl,
                    objectToDraw.normals);
            }
        };
    
    for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
        passVertices(objectsToDraw[i]);
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
    vertexDiffuseColor = gl.getAttribLocation(shaderProgram, "vertexDiffuseColor");
    gl.enableVertexAttribArray(vertexDiffuseColor);
    vertexSpecularColor = gl.getAttribLocation(shaderProgram, "vertexSpecularColor");
    gl.enableVertexAttribArray(vertexSpecularColor);
    normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);
    
    transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");
    projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    
    lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    shininess = gl.getUniformLocation(shaderProgram, "shininess");


    /*
     * Displays an individual object or a composite object. A composite object is
     * marked with a composite property (a boolean), and contains multiple component
     * objects, each of which is a shape object with its own vertices and indices, etc.
     * The composite object drawing function is not working correctly as of right now,
     * so it has been commented out.
     */
    setTransform = function (object) {
        gl.uniformMatrix4fv(transformMatrix, gl.FALSE, new Float32Array(Matrix4x4.instanceTransform(object.transform).elements));
    };

    drawObject = function (object) {
        if (object.shapes) {
            for (var m = 0; m < object.shapes.length; m++) {
                drawObject(object.shapes[m]);
            }
        } else {
            // Set the varying colors.
            setTransform(object);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
            gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0);
        
            // Set the varying normal vectors.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
            gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

            // Set the varying vertex coordinates.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, object.specularBuffer);
            gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);

            // Set the shininess.
            gl.uniform1f(shininess, object.shininess);
            gl.drawArrays(object.mode, 0, object.vertices.length / 3);
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
        
        //Set the lighting
        var sourceX = objectsToDraw[1].transform.dx,
            sourceY = objectsToDraw[1].transform.dy,
            sourceZ = objectsToDraw[1].transform.dz;

        gl.uniform4fv(lightPosition, [sourceX, sourceY, sourceZ, 1.0]);
        gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);
        gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0]);
        
        // Display the objects.
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            drawObject(objectsToDraw[i]); 
        }
        // All done.
        gl.flush();
    };

gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, new Float32Array(
    Matrix4x4.getLookAtMatrix(
        new Vector(0, 0, -8),
        new Vector(0, 0, 100),
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
