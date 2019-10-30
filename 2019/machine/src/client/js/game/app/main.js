
import { Game } from './game.js';

export class Tracking {
    constructor() {
        this.video = document.getElementById("myvideo");
        this.canvas = document.getElementById("tracking");
        this.context = this.canvas.getContext("2d");

        this.imgindex = 1;
        this.isVideo = false;
        this.model = null;
        this.videoInterval = 100;
        this.game = new Game("gameCanvas");

        this.modelParams = {
            flipHorizontal: true, // flip e.g for video  
            maxNumBoxes: 1, // maximum number of boxes to detect
            iouThreshold: 0.5, // ioU threshold for non-max suppression
            scoreThreshold: 0.6, // confidence threshold for predictions.
        }

        // Load the model.
        handTrack.load(this.modelParams).then(lmodel => {
            // detect objects in the image.
            this.model = lmodel;
            this.startVideo();
            console.log("Loaded Model!");
        });
    }

    startVideo() {
        handTrack.startVideo(this.video).then((status)=> {
            console.log("video started", status);
            if (status) {
                console.log("Now tracking");
                this.isVideo = true;
                this.runDetection();
                this.startGame();
            } else {
                console.log("Please enable video");
            }
        });
    }

    runDetection() {
        this.model.detect(this.video).then(predictions => {
            // console.log("Predictions: ", predictions);
            // get the middle x value of the bounding box and map to paddle location
            this.model.renderPredictions(predictions, this.canvas, this.context, this.video);
            if (predictions[0]) {
                console.log('Predictions  X:', predictions[0].bbox[0]);
                console.log('Predictions  Y:', predictions[0].bbox[1]);
                let midval_x = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2);
                let midval_y = predictions[0].bbox[1] + (predictions[0].bbox[3] / 2);
                console.log('Mid  X:', midval_x);
                console.log('Mid  Y:', midval_y);
                let game_x = this.game.client.width * (midval_x / this.video.width);
                let game_y = this.game.client.height * (predictions[0].bbox[1] / (this.video.height * 0.5));
                //updatePaddleControl(gamex)
                console.log('Game  X:', game_x);
                console.log('Game  Y:', game_y);
                game_y = game_y - 100;
                this.game.player.paddle.updatewithTracking(game_y);
                console.log('Paddle x  :' + this.game.player.paddle.position.x);
                console.log('Paddle y  :' + this.game.player.paddle.position.y);
            } 
            if (this.isVideo) {
                setTimeout(() => {
                    this.runDetection(this.video)
                }, this.videoInterval);
            }
        });
    }


    startGame() {
        this.game.start();
    }
}

(function () {
    new Tracking();
})();