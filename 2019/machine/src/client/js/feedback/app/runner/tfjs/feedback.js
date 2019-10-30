import { FeedbackUI } from './feedback-ui.js';
import { Webcam } from './webcam.js';
class FeedbackConstants {
    static NUM_CLASSES = 3;
    static DENSE_UNIT = 100;
    static LEARNING_RATE = 0.0001;
    static BATCH_SIZE = 0.4;
    static EPOCHS = 20;
    static controlsCaptured = ["up", "down", "left"];
    static modelParams = {
        flipHorizontal: true,   // flip e.g for video 
        imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
        maxNumBoxes: 20,        // maximum number of boxes to detect
        iouThreshold: 0.5,      // ioU threshold for non-max suppression
        scoreThreshold: 0.79,    // confidence threshold for predictions.
    };
}
export class Feedback {

    constructor() {
        // initialize the core
        this.init().then(()=>{
            // start
            this.run();
        });
    }
    async init() {
        this.isPredicting = false;
        this.mobilenet = await this.loadMobilenet();
        this.localnet = await this.loadLocalnet();
        console.log('Loaded Mobilenet & Localnet models');
        // Load the model.
        this.handTrackModel = await handTrack.load(FeedbackConstants.modelParams);
        console.log('Loaded HandtrackerJS model');
    }
    async run() {
        try {
            // A webcam class that generates Tensors from the images from the webcam.
            this.webcam = new Webcam(document.getElementById('webcam'));
            await this.webcam.setup();
            console.log('Webcam is on');
            // Warm up the model. This uploads weights to the GPU and compiles the WebGL
            // programs so the first time we collect data from the webcam it will be
            // quick.
            tf.tidy(() => this.mobilenet.predict(this.webcam.capture()));
            this.isPredicting = true;
            this.predict();
        } catch (e) {
            console.log(e);
            FeedbackUI.stopPredicting();
        }
    }
    async loadMobilenet() {
        const mobilenet = await tf.loadLayersModel(
            'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

        // Return a model that outputs an internal activation.
        const layer = mobilenet.getLayer('conv_pw_13_relu');
        return tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
    }
    async loadLocalnet() {
        const localnet = await tf.loadLayersModel(
            'http://localhost:7000/assets/model/feedback/v1/model.json');
        // Return a model that outputs an internal activation.
        return localnet;
    }
    async predict() {
        FeedbackUI.isPredicting();
        while (this.isPredicting) {
            const handTrackPrediction = await this.handTrackModel.detect(this.webcam.webcamElement);
            if (handTrackPrediction && handTrackPrediction.length === 1) {
                // detected only one hand
                const predictedClass = tf.tidy(() => {
                    // Capture the frame from the webcam.
                    const img = this.webcam.capture();

                    // Make a prediction through mobilenet, getting the internal activation of
                    // the mobilenet model.
                    const activation = this.mobilenet.predict(img);

                    // Make a prediction through our newly-trained model using the activation
                    // from mobilenet as input.
                    const predictions = this.localnet.predict(activation);

                    // Returns the index with the maximum probability. This number corresponds
                    // to the class the model thinks is the most probable given the input.
                    return predictions.as1D().argMax();
                });

                let classId = (await predictedClass.data())[0];
                predictedClass.dispose();
                classId = Math.floor(classId);
                const className = FeedbackConstants.controlsCaptured[classId];
                FeedbackUI.toggleState(className);
                await tf.nextFrame();
            } else if (handTrackPrediction && handTrackPrediction.length > 1) {
                // more than 1 hand detected
                console.info(":: More than 1 hand detected! ::")
                FeedbackUI.removeActiveClass();

            } else {
                // no hand detected
                console.info(":: No hand detected! ::")
                FeedbackUI.removeActiveClass();
            }
        }
        FeedbackUI.donePredicting();
    }
}