/*
Sound module for the Corridor project.
*/

class Analysis {
    /*
    A class for the analysis of an input sound.
    The input sound spectrum is obtained via FFT, and the BPM is measured on a
    specific band of this spectrum.
    */

    constructor(band, threshold) {
        this.band = band;
        this.threshold = threshold;
        this.size = 500;

        this.fft = new p5.FFT(0.8, 16);
        this.spectrum = [];
        this.amplitude_history = [0.0];
    }

    analyze() {
        /*
        Analyze input sound using FFT.
        Output:
            -bpm    float
        */

        this.spectrum = this.fft.analyze()

        // inserting new values in the amplitude history
        this.amplitude_history.push(this.spectrum[this.band])

        // removing old values if the maximum sized is reached
        if (this.amplitude_history.length > this.size) {
            this.amplitude_history.shift();
        }

        // BPM
        let count = 0;
        for (var i = 0; i < this.amplitude_history.length; i++){
            if (this.amplitude_history[i] > this.threshold) {
                count += 1;
            }
        }
        let bpm = count / this.amplitude_history.length;

        return bpm

    }

    display_setup(canvas_width, canvas_height, source, p5js){
        /*
        P5.js related setup function for this analysis display.
        Input:
            -canvas_width   int
            -canvas_height  int
            -source         p5.sound object
            -p5js           p5.js instance
        */
        this.canvas = p5js.createCanvas(canvas_width, canvas_height);
        this.fft.setInput(source)
    }

    display_spectrum(p5js) {
        /*
        Display spectrum of input sound.
        Input:
            -p5js   p5.js instance
        */
        p5js.noStroke();
        p5js.fill(0, 255, 0); // spectrum is green
        for (var i = 0; i < this.spectrum.length; i++){
            var x = p5js.map(i, 0, this.spectrum.length, 0, this.canvas.width);
            var h = -this.canvas.height + p5js.map(
                this.spectrum[i],
                0,
                255,
                this.canvas.height,
                0
            );
            p5js.rect(x, this.canvas.height, this.canvas.width / this.spectrum.length, h)
        }
    }

    display_band_signal(p5js) {
        /*
        Display amplitude signal of analyzed band.
        Input:
            -p5js   p5.js instance
        */
        p5js.noFill();
        p5js.beginShape();
        p5js.stroke(255, 0, 0);
        p5js.strokeWeight(1);
        for (var i = 0; i< this.amplitude_history.length; i++){
          var x = p5js.map(i, 0, this.amplitude_history.length, 0, this.canvas.width);
          var y = p5js.map( this.amplitude_history[i], 0, 255, 0, this.canvas.height);
          p5js.vertex(x, y);
        }
        p5js.endShape();
    }

    display_threshold(p5js) {
        /*
        Display threshold for this analysis to detect beats and count BPM.
        Input:
            -p5js   p5.js instance
        */
        p5js.noFill();
        p5js.stroke(0, 0, 255);
        p5js.strokeWeight(1);
        p5js.line(
            0,
            this.threshold*this.canvas.height/255,
            this.canvas.width,
            this.threshold*this.canvas.height/255,
        );
    }


}
