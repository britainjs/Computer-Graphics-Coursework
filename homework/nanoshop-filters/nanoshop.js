/*
 * This is a very simple module that demonstrates rudimentary,
 * pixel-level image processing.
 */
var Nanoshop = {
    /*
     * Applies the given filter to the given ImageData object,
     * then modifies its pixels according to the given filter.
     *
     * A filter is a function (r, g, b, a) that returns another
     * pixel as a 4-element array representing an RGBA value.
     */
    applyFilter: function (imageData, filter) {
        // For every pixel, replace with something determined by the filter.
        var i,
            j,
            max,
            pixel,
            pixelArray = imageData.data;

        for (i = 0, max = imageData.width * imageData.height * 4; i < max; i += 4) {
            pixel = filter(pixelArray[i], pixelArray[i + 1], pixelArray[i + 2], pixelArray[i + 3]);
            for (j = 0; j < 4; j += 1) {
                pixelArray[i + j] = pixel[j];
            }
        }

        return imageData;
    },
    
    //A filter that turns the image into a grayscale image.
    grayScale: function (r, g, b, a) {
        var average = (r + g + b)/2;
        return [average, average, average, a];
    },
    
    // Only display the blue value of each pixel
    blueShift: function (r, g, b, a) {
        return [0, 0, b, a];
    },
    
    //Only display the red value of each pixel
    redShift: function (r, g, b, a) {
        return [r, 0, 0, a];
    },
    
    // Only display the green value of each pixel
    greenShift: function (r, g, b, a) {
        return [0, g, 0, a];
    },
    
    //Randomize each pixel, creating an effect that looks like tv static.
    madness: function (r, g, b, a) {
        var colors = [r, g, b, a];
        for(var i = 0; i < colors.length - 1; i++){
            colors[i] = Math.floor(Math.random() * 256);
        }
        return colors;
    }
};
