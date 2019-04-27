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
        -angle      rotation angle (radians)
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

function circle_equation(radius, t){
    /*
    Circle equation.
    Input:
        -radius
        -t
    Output:
        -output     X, Y coordinates
    */
    return [
        radius * Math.cos(t),
        radius * Math.sin(t)
    ]
}

class Square{

    constructor(side, angle, center){
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
        this.size_min = 5;
        this.size_max = 400;
        this.velocity = 1.1;
        this.rotational_velocity = 0.01;
        this.period= 3;
        this.frames = [];
    }

    update(elapsed_time){

        // update each frame
        for (let i = 0; i < this.frames.length; i++){

            // make frames larger
            this.frames[i].side *= this.velocity;

        }

        // insert new frames periodically
        if (elapsed_time % this.period == 0){
            this.frames.push(new Square(
                this.size_min,
                elapsed_time * this.rotational_velocity,
                circle_equation(50, elapsed_time * 0.05)
            ));
        }

        // get rid of first frame if larger than max size
        if (this.frames[0].side > this.size_max){
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
