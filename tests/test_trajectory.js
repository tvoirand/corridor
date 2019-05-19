/*
This is a test script similar to the main "sketch.js" script, but only
displaying the trajectory of the center of each new frames in the corridor.
*/

// global variables
let canvas_width = 800;
let canvas_height = 600;


class Corridor{

    constructor(){
        this.velocity = 1.1;
        this.period= 3;
        this.distance_max = 200;
        this.center = [100, 200];
        this.trajectory = new SegmentTraj(
            [100, 200],
            0,
            this.distance_max
        );
    }

    update(elapsed_time){
        /*
        Move center periodically
        */

        // Move center periodically
        if (elapsed_time % this.period == 0){
            this.center = this.trajectory.compute_new_point(elapsed_time)
        }

    }

    display(){
        ellipse(this.center[0], this.center[1], 10, 10)
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

    ellipse(0, 0, 10, 10)

    my_corridor.update(elapsed_time);
    my_corridor.display();

    elapsed_time += 1;

    if (elapsed_time % 100 == 0){
        my_corridor.trajectory = new SegmentTraj(
            my_corridor.center,
            elapsed_time,
            my_corridor.distance_max
        )
    } else if (elapsed_time % 100 == 50){
        my_corridor.trajectory = new CircleTraj(
            my_corridor.center,
            elapsed_time,
            my_corridor.distance_max
        )
    }

}
