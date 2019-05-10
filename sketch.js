/*
Processing.js tryouts
*/

// global variables
let canvas_width = 800;
let canvas_height = 600;


class Corridor{

    constructor(){
        this.velocity = 1.1;
        this.rotational_velocity = 0.01;
        this.period= 3;
        this.distance_max = 200;
        this.frames = [];
        this.trajectory = new Trajectory(
            `segment`,
            [100, 200],
            0,
            this.distance_max
        );
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
                5, // side
                elapsed_time * this.rotational_velocity, // angle
                this.trajectory.compute_new_point(elapsed_time), // center
                Math.sqrt(2) * Math.max(canvas_width, canvas_height) // size_max
            ));
        }

        // get rid of first frame if larger than max size
        if (this.frames[0].side > this.frames[0].size_max){
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

    if (elapsed_time % 100 == 0){
        my_corridor.trajectory = new Trajectory(
            `segment`,
            my_corridor.frames[my_corridor.frames.length - 1].center,
            elapsed_time,
            my_corridor.distance_max
        )
    } else if (elapsed_time % 100 == 50){
        my_corridor.trajectory = new Trajectory(
            `circle`,
            my_corridor.frames[my_corridor.frames.length - 1].center,
            elapsed_time,
            my_corridor.distance_max
        )
    }

}
