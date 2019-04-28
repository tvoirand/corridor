/*
Test script for the corridor project.
*/

// global variables
let canvas_width = 800;
let canvas_height = 600;

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

function segment_2(start_point, elapsed_time){
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

function segment_1(start_point, elapsed_time){
    let x_start = start_point[0];
    let y_start = start_point[1];
    let time = elapsed_time % (4 * x_start);
    if (time < 2 * x_start){
        return [
            x_start - time,
            y_start - y_start / x_start * time
        ]
    } else {
        return [
            - x_start + (time - 2 * x_start),
            - y_start + y_start / x_start * (time - 2 * x_start)
        ]
    }
}

class Trajectory{

    constructor(start_point, start_time){
        /*
        Input:
            -type           str (just circle for now)
            -start_point    [X, Y]
            -start_time     float
        */
        this.start_point = start_point;
        this.start_time = start_time;
        this.points = [];
    }

    compute_new_point(elapsed_time){
        /*
        Input:
            -elapsed_time
        Output:
            -new_point      [X, Y]
        */
        return segment_2(this.start_point, elapsed_time)
    }

}

let elapsed_time = 0;
my_trajectory = new Trajectory([0, 50], 0);

function setup() {
    /*
    Processing setup function.
    Called one time at start.
    */
    createCanvas(canvas_width, canvas_height);
    stroke(255);
    frameRate(30);
}

function draw() {
    /*
    Processing main loop function.
    */

    // initialisation
    translate(width/2, height/2);
    background(0);

    my_trajectory.points.push(my_trajectory.compute_new_point(elapsed_time));

    ellipse(
        my_trajectory.points[elapsed_time][0],
        my_trajectory.points[elapsed_time][1],
        10,
        10
    )

    elapsed_time += 1;

}
