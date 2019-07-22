
function start_fft_sketch() {

    var fft_sketch = function(p5js) {
        /*
        Input:
            -p5js   p5js instance
        */

        let canvas_width = 800;
        let canvas_height = 600;
        let mic;

        let band = 3;

        p5js.setup = function() {

            mic = new p5.AudioIn();
            mic.start();
            my_analysis = new Analysis(band, 20);
            my_analysis.display_setup(canvas_width, canvas_height, mic, p5js);

        }

        p5js.draw = function() {

            p5js.background(0);

            bpm = my_analysis.analyze();

            my_analysis.display_spectrum(p5js);
            my_analysis.display_band_signal(p5js);
            my_analysis.display_threshold(p5js);

            p5js.text('click to play/pause', 4, 10);
            p5js.text('BPM: ' + bpm, 4, 20);
            p5js.text('band: ' + band, 4, 30);

        }

    }

    var myp5 = new p5(fft_sketch);

}
