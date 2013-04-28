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
    
    sphere: function (latitude, longitude, radius) {
        //Adapted from github.com/gpjt/webgl-lessons/blob/master/lesson11/index.html
        
            var vertices = [],
                indexData = [];
        for (var latNumber = 0; latNumber <= latitude; latNumber++) {
            var theta = latNumber * Math.PI / latitude,
                sinTheta = Math.sin(theta),
                cosTheta = Math.cos(theta);

            for (var longNumber = 0; longNumber <= longitude; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitude,
                    sinPhi = Math.sin(phi),
                    cosPhi = Math.cos(phi),
                    x = cosPhi * sinTheta,
                    y = cosTheta,
                    z = sinPhi * sinTheta;

                vertices.push([radius * x, radius * y, radius * z]);
            }
         }

         for (var latNumber = 0; latNumber < latitude; latNumber++) {
             for (var longNumber = 0; longNumber < longitude; longNumber++) {
                 var first = (latNumber * (longitude + 1)) + longNumber,
                     second = first + longitude + 1;
                 indexData.push([first, second, first + 1]);

                 indexData.push([second, second + 1, first + 1]);
             }
         }
      
         return {
             vertices: vertices,
             indices: indexData
         }
    },
    
        /*
     * Utility function for computing normal vectors based on indexed vertices.
     * The secret: take the cross product of each triangle.  Note that vertex order
     * now matters---the resulting normal faces out from the side of the triangle
     * that "sees" the vertices listed counterclockwise.
     *
     * The vector computations involved here mean that the Vector module must be
     * loaded up for this function to work.
     */
    toNormalArray: function (indexedVertices) {
        var result = [],
            i,
            j,
            maxi,
            maxj,
            p0,
            p1,
            p2,
            v0,
            v1,
            v2,
            normal;

        // For each face...
        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            // We form vectors from the first and second then second and third vertices.
            p0 = indexedVertices.vertices[indexedVertices.indices[i][0]];
            p1 = indexedVertices.vertices[indexedVertices.indices[i][1]];
            p2 = indexedVertices.vertices[indexedVertices.indices[i][2]];

            // Technically, the first value is not a vector, but v can stand for vertex
            // anyway, so...
            v0 = new Vector(p0[0], p0[1], p0[2]);
            v1 = new Vector(p1[0], p1[1], p1[2]).subtract(v0);
            v2 = new Vector(p2[0], p2[1], p2[2]).subtract(v0);
            normal = v1.cross(v2).unit();

            // We then use this same normal for every vertex in this face.
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    [ normal.x(), normal.y(), normal.z() ]
                );
            }
        }

        return result;
    },

    /*
     * Another utility function for computing normals, this time just converting
     * every vertex into its unit vector version.  This works mainly for objects
     * that are centered around the origin.
     */
    toVertexNormalArray: function (indexedVertices) {
        var result = [],
            i,
            j,
            maxi,
            maxj,
            p,
            normal;

        // For each face...
        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            // For each vertex in that face...
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                p = indexedVertices.vertices[indexedVertices.indices[i][j]];
                normal = new Vector(p[0], p[1], p[2]).unit();
                result = result.concat(
                    [ normal.x(), normal.y(), normal.z() ]
                );
            }
        }

        return result;
    }

};
