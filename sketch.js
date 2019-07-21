/*
Processing.js tryouts
*/

// global variables
let canvas_width = 800;
let canvas_height = 600;
let mic;
let frame_rate = 30; //frames per second
let volume_history = [0.0];

class Corridor{

    constructor(){
        this.velocity = 1.1; // ratio at which frames grow bigger
        this.rotational_velocity = 0.0;
        this.period = 3; // rate at which new frames are inserted
        this.distance_max = 200; // distance from center upper limit
        this.frames = [];
        this.trajectory = new SegmentTraj(
            [100, 200], // start point
            0, // start time
            this.distance_max // max distance
        );
    }

    update(elapsed_time, new_frames_color){
        /*
        Enlarge each frame, insert new small frames and remove large frames.
        Input:
            -elapsed_time       float
            -new_frames_color   float
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
                Math.sqrt(2) * Math.max(canvas_width, canvas_height), // size_max
                new_frames_color
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
    frameRate(frame_rate);
    mic = new p5.AudioIn();
    mic.start();
}


function draw() {
    /*
    Processing main loop function.
    */

    // initialisation
    translate(width/2, height/2);
    background(0);

    // adjust new_frames_color to mic volume
    let current_volume = mic.getLevel();
    volume_history.push(current_volume);
    current_volume_normalized = normalize(current_volume, volume_history);
    let new_frames_color = 255*current_volume_normalized;

    my_corridor.update(elapsed_time, new_frames_color);
    my_corridor.display();

    elapsed_time += 1;

    if (elapsed_time % 100 == 0){
        my_corridor.trajectory = new SegmentTraj(
            my_corridor.frames[my_corridor.frames.length - 1].center,
            elapsed_time,
            my_corridor.distance_max
        )
    } else if (elapsed_time % 100 == 50){
        my_corridor.trajectory = new CircleTraj(
            my_corridor.frames[my_corridor.frames.length - 1].center,
            elapsed_time,
            my_corridor.distance_max
        )
    }

}
