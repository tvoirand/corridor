
let canvas_width = 800;
let canvas_height = 600;
let mic;

let band = 3;

function setup(){
    mic = new p5.AudioIn();
    mic.start();
    my_analysis = new Analysis(band, 125);
    my_analysis.display_setup(canvas_width, canvas_height, mic);
}

function draw(){
    background(0);


    bpm = my_analysis.analyze();

    my_analysis.display_spectrum();
    my_analysis.display_band_signal();


    text('click to play/pause', 4, 10);

    text('BPM: ' + bpm, 4, 20);

    text('band: ' + band, 4, 30);
}
