/*
 * Unit tests for our Animator object.
 */
$(function () {

    // This suite checks instantiation basics.
    test("Helper functions", function () {
        var radii = Animator.getRadii();

        equal(1, radii.horizontalRadius, "No radius given");
        equal(1, radii.verticalRadius, "No radius given");

        radii = Animator.getRadii(5);
        equal(5, radii.horizontalRadius, "Only one radius");
        equal(5, radii.verticalRadius, "Only one radius");

        radii = Animator.getRadii(5, 10);
        equal(5, radii.horizontalRadius, "Both radii given");
        equal(10, radii.verticalRadius, "Both radii given");
    });

});
