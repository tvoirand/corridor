/*
Processing.js tryouts
*/

// global variables
let canvas_width = 800;
let canvas_height = 600;


class Corridor{

    constructor(){
        this.velocity = 1.1;
        this.period= 3;
        this.center = [100, 200];
        this.trajectory = new Trajectory(`segment`, [100, 200], 0);
    }

    update(elapsed_time){
        /*
        Enlarge each frame, insert new small frames and remove large frames.
        */

        // insert new frames periodically
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
        my_corridor.trajectory = new Trajectory(
            `segment`,
            my_corridor.center,//my_corridor.frames[my_corridor.frames.length - 1].center,
            elapsed_time
        )
    } else if (elapsed_time % 100 == 50){
        my_corridor.trajectory = new Trajectory(
            `circle`,
            my_corridor.center,//my_corridor.frames[my_corridor.frames.length - 1].center,
            elapsed_time
        )
    }

}
