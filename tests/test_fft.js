
let canvas_width = 800;
let canvas_height = 600;

let amplitude_history = [0.0];

let band = 3;

function preload(){
    sound = loadSound('tests/08_8_624_part2.mp3');
    // sound = loadSound('tests/the-deli-532pm.mp3');
    // sound = loadSound('tests/salut-cest-cool-techno-toujours-pareil.mp3');
}

function setup(){
    my_analysis = new Analysis(band, 125);
    my_analysis.display_setup(canvas_width, canvas_height);
    sound.amp(0.2);
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
