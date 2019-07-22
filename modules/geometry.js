/*
Geometry module for the corridor project.
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

function segment_through_center(
    start_point,
    elapsed_time,
    distance_max,
    direction_is_inward
){
    /*
    Describes segment with center at [0, 0] and one end at start_point.
    Input:
        -start_point            [X, Y]
        -elapsed_time
        -distance_max           float
            distance from center upper limit
        -direction_is_inward    bool
            defines if moving towards center or away from center at start
    Output:
        -new_point              [X, Y]
    */

    // rotate reference frame to have start_point on X-axis
    let angle = Math.atan2(start_point[1], start_point[0]);
    let start_point_proj = point_rotation(start_point, -angle);

    let new_point_proj_x;
    if (direction_is_inward == true){
        // time to travel from distance_max to center is set to proj_point X value.
        let time = elapsed_time % (4 * distance_max) + distance_max - start_point_proj[0];

        if (time < 2 * distance_max){
            // start_point - end_point portion
            new_point_proj_x = distance_max - time;
        } else {
            // end_point - start_point portion
            new_point_proj_x = - 3 * distance_max + time;
        }
    } else {
        // time to travel from distance_max to center is set to proj_point X value.
        if (elapsed_time < distance_max - start_point_proj[0]){
            new_point_proj_x = start_point_proj[0] + elapsed_time;
        } else {
            let time = (elapsed_time + start_point_proj[0] - distance_max) % (4 * distance_max);
            if (time < 2 * distance_max){
                // start_point - end_point portion
                new_point_proj_x = distance_max - time;
            } else {
                // end_point - start_point portion
                new_point_proj_x = - 3 * distance_max + time;
            }
        }
    }
    // return new point described in initial reference frame
    return point_rotation([new_point_proj_x, 0], angle)

}

function circle_equation(start_point, t){
    /*
    Describes circle.
    Input:
        -start_point
        -t
    Output:
        -new_point      [X, Y]
    */

    // rotate reference frame to have start_point on X-axis
    let angle = Math.atan2(start_point[1], start_point[0]);
    let projected_point = point_rotation(start_point, -angle);

    // compute point on circle in rotated reference frame
    let radius = projected_point[0]
    let new_projected_point = [
        radius * Math.cos(t),
        radius * Math.sin(t)
    ]

    // return new point described in initial reference frame
    return point_rotation(new_projected_point, angle)
}

class Trajectory{

    constructor(start_point, start_time, distance_max){
        /*
        Input:
            -start_point    [X, Y]
            -start_time     float
            -distance_max   float
                distance from center upper limit for this trajectory
        */

        this.start_point = start_point;
        this.start_time = start_time;
        this.distance_max = distance_max;

    }

}

class SegmentTraj extends Trajectory{

    constructor(start_point, start_time, distance_max){
        super(start_point, start_time, distance_max);
        this.direction_is_inward = Math.random() >= 0.5;
    }

    compute_new_point(elapsed_time){
        /*
        Input:
            -elapsed_time
        Output:
            -new_point      [X, Y]
        */

        return segment_through_center(
            this.start_point,
            elapsed_time - this.start_time,
            this.distance_max,
            this.direction_is_inward
        )

    }

}

class CircleTraj extends Trajectory{

    constructor(start_point, start_time, distance_max){
        super(start_point, start_time, distance_max);
    }

    compute_new_point(elapsed_time){
        /*
        Input:
            -elapsed_time
        Output:
            -new_point      [X, Y]
        */

        return circle_equation(
            this.start_point,
            (elapsed_time - this.start_time) * Math.PI/180
        )

    }

}


/* Shapes ================================================================= */

class Square{

    constructor(side, angle, center, size_max, color){
        /*
        Input:
            -side
            -angle      radians
            -center     [X, Y]
            -size_max
        */
        this.side = side;
        this.angle = angle;
        this.center = center;
        this.size_max = size_max;
        this.color = color;
    }

    display(p5js){
        /*
        Input:
            -p5js   p5.js instance
        */

        let corners = [
            [-this.side/2, -this.side/2],
            [-this.side/2, this.side/2],
            [this.side/2, this.side/2],
            [this.side/2, -this.side/2]
        ];

        for (let i = 0; i < corners.length; i++){
            corners[i] = point_rotation(corners[i], this.angle);
            corners[i] = point_translation(corners[i], this.center)
        }

        p5js.stroke(this.color);

        p5js.line(corners[0][0], corners[0][1], corners[1][0], corners[1][1]);
        p5js.line(corners[1][0], corners[1][1], corners[2][0], corners[2][1]);
        p5js.line(corners[2][0], corners[2][1], corners[3][0], corners[3][1]);
        p5js.line(corners[3][0], corners[3][1], corners[0][0], corners[0][1]);
    }

}
