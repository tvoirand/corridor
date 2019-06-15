
let canvas_width = 800;
let canvas_height = 600;

let amplitude_history = [0.0];

function preload(){
    sound = loadSound('tests/the-deli-532pm.mp3');
    // sound = loadSound('tests/salut-cest-cool-techno-toujours-pareil.mp3');
}

function setup(){
    var cnv = createCanvas(canvas_width, canvas_height);
    cnv.mouseClicked(togglePlay);
    // fft = new p5.FFT(0.8, 16);
    my_analysis = new Analysis(3, 125)
    sound.amp(0.2);
}

function draw(){
    background(0);


    bpm = my_analysis.analyze();

    my_analysis.display_spectrum(canvas_width, canvas_height);
    my_analysis.display_band_signal(canvas_width, canvas_height);


    text('click to play/pause', 4, 10);

    text('BPM: ' + bpm, 4, 20)
}

// fade sound if mouse is over canvas
function togglePlay() {
    if (sound.isPlaying()) {
        sound.pause();
    } else {
        sound.loop();
    }
}
