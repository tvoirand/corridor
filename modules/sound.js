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

    display_spectrum(canvas_width, canvas_height) {
        /*
        Display spectrum of input sound
        Input:
            -canvas_width   int
            -canvas_height  int
        */
        noStroke();
        fill(0, 255, 0); // spectrum is green
        for (var i = 0; i < this.spectrum.length; i++){
            var x = map(i, 0, this.spectrum.length, 0, canvas_width);
            var h = -canvas_height + map(
                this.spectrum[i],
                0,
                255,
                canvas_height,
                0
            );
            rect(x, canvas_height, canvas_width / this.spectrum.length, h)
        }
    }

    display_band_signal(canvas_width, canvas_height) {
        /*
        Display amplitude signal of analyzed band.
        Input:
            -canvas_width   int
            -canvas_height  int
        */
        noFill();
        beginShape();
        stroke(255, 0, 0);
        strokeWeight(1);
        for (var i = 0; i< this.amplitude_history.length; i++){
          var x = map(i, 0, this.amplitude_history.length, 0, canvas_width);
          var y = map( this.amplitude_history[i], 0, 255, 0, canvas_height);
          vertex(x, y);
        }
        endShape();
    }


}
