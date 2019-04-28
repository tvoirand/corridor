/*
Processing.js tryouts
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

class Trajectory{

    constructor(type, start_point, start_time){
        /*
        Input:
            -type           str (can be circle or segment for now)
            -start_point    [X, Y]
            -start_time     float
        */

        this.type = type;
        this.start_point = start_point;
        this.start_time = start_time;

        if (this.type == `circle`){
            this.radius = Math.sqrt(
                Math.pow(start_point[0], 2) + Math.pow(start_point[1], 2)
            );
        }

    }

    compute_new_point(elapsed_time){
        /*
        Input:
            -elapsed_time
        Output:
            -new_point      [X, Y]
        */

        if (this.type == `circle`){
            return circle_equation(
                this.radius, elapsed_time*0.05 - this.start_time
            )
        } else if (this.type == `segment`){
            return segment_through_center(
                this.start_point, elapsed_time - this.start_time
            )
        }

    }

}

class Square{

    static size_min = 5;
    static size_max = Math.sqrt(2) * Math.max(canvas_width, canvas_height);

    constructor(side, angle, center){
        /*
        Input:
            -side
            -angle      radians
            -center     [X, Y]
        */

        this.side = side;
        this.angle = angle;
        this.center = center;
    }

    display(){

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

        line(corners[0][0], corners[0][1], corners[1][0], corners[1][1]);
        line(corners[1][0], corners[1][1], corners[2][0], corners[2][1]);
        line(corners[2][0], corners[2][1], corners[3][0], corners[3][1]);
        line(corners[3][0], corners[3][1], corners[0][0], corners[0][1]);
    }

}

class Corridor{

    constructor(){
        this.velocity = 1.1;
        this.rotational_velocity = 0.0;
        this.period= 3;
        this.frames = [];
        this.trajectory = new Trajectory(`segment`, [0, 50], 0);
    }

    update(elapsed_time){
        /*
        Enlarge each frame, insert new small frames and remove large frames.
        */

        // update each frame
        for (let i = 0; i < this.frames.length; i++){

            // make frames larger
            this.frames[i].side *= this.velocity;

        }

        // insert new frames periodically
        if (elapsed_time % this.period == 0){
            this.frames.push(new Square(
                Square.size_min,
                elapsed_time * this.rotational_velocity,
                this.trajectory.compute_new_point(elapsed_time)
            ));
        }

        // get rid of first frame if larger than max size
        if (this.frames[0].side > Square.size_max){
            this.frames.shift();
        }

    }

    display(){
        for (let i = 0; i < this.frames.length; i++){
            this.frames[i].display();
        }
    }

}

let elapsed_time = 0;
let my_corridor = new Corridor;

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

    my_corridor.update(elapsed_time);
    my_corridor.display();

    elapsed_time += 1;

}
