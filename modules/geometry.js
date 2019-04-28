/*
Geometry modules for the corridor project.
*/


/* Transformations ======================================================== */

function point_rotation(input, angle){
    /*
    Apply rotation around center to XY coordinates.
    Input:
        -input      X, Y coordinates
        -angle      radians
    Output:
        -output     X, Y coordinates
    */
    return [
        input[0] * Math.cos(angle) - input[1] * Math.sin(angle),
        input[1] * Math.cos(angle) + input[0] * Math.sin(angle)
    ]
}

function point_translation(input, vector){
    /*
    Apply translation.
    Input:
        -input      X, Y coordinates
        -vector     X, Y coordinates
    Output:
        -output     X, Y coordinates
    */
    return [
        input[0] + vector[0],
        input[1] + vector[1]
    ]
}


/* Trajectories =========================================================== */


function segment_through_center(start_point, elapsed_time){
    /*
    Describes segment with center at [0, 0] and one end at start_point.
    Input:
        -start_point    [X, Y]
        -elapsed_time
    Output:
        -new_point      [X, Y]
    */

    // rotate reference frame to have start_point on X-axis
    let angle = Math.atan2(start_point[1], start_point[0]);
    let projected_point = point_rotation(start_point, -angle);

    // time to travel from start_point to center is set to proj_point X value.
    let time = elapsed_time % (4 * projected_point[0])
    let new_projected_x;
    if (time < 2 * projected_point[0]){
        // start_point - end_point portion
        new_projected_x = projected_point[0] - time;
    } else {
        // end_point - start_point portion
        new_projected_x = - 3 * projected_point[0] + time;

    }

    return point_rotation([new_projected_x, 0], angle)
}

function circle_equation(radius, t){
    /*
    Describes circle.
    Input:
        -radius
        -t
    Output:
        -new_point      [X, Y]
    */
    return [
        radius * Math.cos(t),
        radius * Math.sin(t)
    ]
}



/* Shapes ================================================================= */
