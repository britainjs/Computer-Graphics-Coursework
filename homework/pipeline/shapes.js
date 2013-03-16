/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */
var Shapes = {
    /*
     * Returns the vertices for a small icosahedron.
     */
    icosahedron: function () {
        // These variables are actually "constants" for icosahedron coordinates.
        var X = 0.525731112119133606,
            Z = 0.850650808352039932;

        return {
            vertices: [
                [ -X, 0.0, Z ],
                [ X, 0.0, Z ],
                [ -X, 0.0, -Z ],
                [ X, 0.0, -Z ],
                [ 0.0, Z, X ],
                [ 0.0, Z, -X ],
                [ 0.0, -Z, X ],
                [ 0.0, -Z, -X ],
                [ Z, X, 0.0 ],
                [ -Z, X, 0.0 ],
                [ Z, -X, 0.0 ],
                [ -Z, -X, 0.0 ]
            ],

            indices: [
                [ 1, 4, 0 ],
                [ 4, 9, 0 ],
                [ 4, 5, 9 ],
                [ 8, 5, 4 ],
                [ 1, 8, 4 ],
                [ 1, 10, 8 ],
                [ 10, 3, 8 ],
                [ 8, 3, 5 ],
                [ 3, 2, 5 ],
                [ 3, 7, 2 ],
                [ 3, 10, 7 ],
                [ 10, 6, 7 ],
                [ 6, 11, 7 ],
                [ 6, 0, 11 ],
                [ 6, 1, 0 ],
                [ 10, 1, 6 ],
                [ 11, 0, 9 ],
                [ 2, 11, 9 ],
                [ 5, 2, 9 ],
                [ 11, 2, 7 ]
            ]
        };
    },

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as triangles.
     */
    toRawTriangleArray: function (indexedVertices) {
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ]
                );
            }
        }

        return result;
    },

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as line segments.
     */
    toRawLineArray: function (indexedVertices) {
        console.log("HERE!");
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ],

                    indexedVertices.vertices[
                        indexedVertices.indices[i][(j + 1) % maxj]
                    ]
                    
                );
                
            }
        }
        console.log(result);
        return result;
    },
    
    tetrahedron: function () {
        return {
            vertices: [
                //top
                [0.0, 1.0, 0.0],
                //front left
                [-0.5, 0.0, -0.5],
                //front right
                [0.5, 0.0, -0.5],
                //back
                [-0.5, 0.0, 0.5]
            ],
            
            indices: [
                [0, 1, 2],
                [0, 3, 1],
                [0, 3, 2],
                [1, 3, 2]
            ]
        
        };
    
    },
    
    blade: function () {
        return {
            vertices: [
                //point
                [-1.0, 0.0, 0.0],
                //back
                [-0.85, 0.0, -0.1],
                //front
                [-0.85, 0.0, 0.1],
                //top
                [-0.90, 0.025, 0.0],
                //bottom
                [-0.9, -0.025, 0.0],
                //base top back
                [0.5, 0.025, -0.1] ,
                //base bottom back
                [0.5, -0.025, -0.1],
                //base top front
                [0.5, 0.025, 0.1],
                //base bottom front
                [0.5, -0.025, 0.1],
                //middle top
                [0.5, 0.025, 0.0],
                //middle bottom
                [0.5, -0.025, 0.0]
            ],
            
            indices: [
                [0, 1],
                [1, 5],
                [1, 6],
                [0, 3],
                [3, 9],
                [0, 4],
                [4, 10],
                [0, 2],
                [2, 7],
                [2, 8],
                [5, 6, 7, 8],
                [3, 2],
                [3, 1],
                [4, 2],
                [4, 1]
            ]
        }
    },
    
    sphere: function (latitude, longitude) {
        //Adapted from Angel's book
        
        var DEGREES_TO_RADIANS = Math.PI / 180.0;
        var points = [];
        var index = 0;
        
        for (var phi = -80.0; phi <= 80.0; phi += latitude) {
            var rPhi = phi * DEGREES_TO_RADIANS;
            var rPhiPlus = (phi + latitude) * DEGREES_TO_RADIANS;
            
            for (var theta = -180.0; theta <= 180.0; theta += longitude) {
                var rTheta = theta * DEGREES_TO_RADIANS;
                points[index] = [
                                    Math.sin(rTheta) * Math.cos(rPhi), 
                                    Math.cos(rTheta) * Math.cos(rPhi) ,
                                    Math.sin(rPhi)
                                 ];
                index += 1;
                
                points[index] = [
                                    Math.sin(rTheta) * Math.cos(rPhiPlus),
                                    Math.cos(rTheta) * Math.cos(rPhiPlus),
                                    Math.sin(rPhiPlus)
                                ];
                index += 1;
            }
        }
        
        var route = [];
        var j = 0;
        points = points.concat([0, 0, 1]);
        //Time to set the indices
        for (var i = 0; i <= points.length; i += 2) {
            route[j] = [i, i + 1];
            j += 1;
        }
        
        return {
            vertices: points,
            indices:  route
        }
    }

};
