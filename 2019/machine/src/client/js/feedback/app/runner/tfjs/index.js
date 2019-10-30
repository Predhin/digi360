(function () {
    // The number of classes we want to predict.

    const NUM_CLASSES = 3;
    const DENSE_UNIT = 100;
    const LEARNING_RATE = 0.0001;
    const BATCH_SIZE = 0.4;
    const EPOCHS = 20;
    const controlsCaptured = ["up", "down", "left"];
    let webcam;
    let mobilenet;
    let localnet;
    let model;
    let handTrackModel;
    let isPredicting = false;

    // Loads mobilenet and returns a model that returns the internal activation
    // we'll use as input to our classifier model.
    async function loadMobilenet() {
        const mobilenet = await tf.loadLayersModel(
            'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

        // Return a model that outputs an internal activation.
        const layer = mobilenet.getLayer('conv_pw_13_relu');
        return tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
    }

    // Loads localnet and returns a model that returns the internal activation
    // we'll use as input to our classifier model.
    async function loadLocalnet() {
        const localnet = await tf.loadLayersModel(
            'http://localhost:7000/assets/model/feedback/v1/model.json');
        // Return a model that outputs an internal activation.
        return localnet;
    }


    async function init() {
        try {
            // A webcam class that generates Tensors from the images from the webcam.
            webcam = new Webcam(document.getElementById('webcam'));
            await webcam.setup();
            console.log('Webcam is on');
            mobilenet = await loadMobilenet();
            localnet = await loadLocalnet();
            console.log('Loaded Mobilenet & Localnet models');

            // Warm up the model. This uploads weights to the GPU and compiles the WebGL
            // programs so the first time we collect data from the webcam it will be
            // quick.
            tf.tidy(() => mobilenet.predict(webcam.capture()));
            isPredicting = true;
            // Load the model.
            const modelParams = {
                flipHorizontal: true,   // flip e.g for video 
                imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
                maxNumBoxes: 20,        // maximum number of boxes to detect
                iouThreshold: 0.5,      // ioU threshold for non-max suppression
                scoreThreshold: 0.79,    // confidence threshold for predictions.
              }
            handTrackModel = await handTrack.load(modelParams);
            predict();
        } catch (e) {
            console.log(e);
            document.getElementById('no-webcam').style.display = 'block';
            document.getElementById('webcam-inner-wrapper').className =
                'webcam-inner-wrapper center grey-bg';
        }
    }
    async function predict() {
        predicting();
        while (isPredicting) {
            const handTrackPrediction = await handTrackModel.detect(webcam.webcamElement);
            if (handTrackPrediction && handTrackPrediction.length === 1) {
                // detected only one hand
                const predictedClass = tf.tidy(() => {
                    // Capture the frame from the webcam.
                    const img = webcam.capture();

                    // Make a prediction through mobilenet, getting the internal activation of
                    // the mobilenet model.
                    const activation = mobilenet.predict(img);

                    // Make a prediction through our newly-trained model using the activation
                    // from mobilenet as input.
                    const predictions = localnet.predict(activation);

                    // Returns the index with the maximum probability. This number corresponds
                    // to the class the model thinks is the most probable given the input.
                    return predictions.as1D().argMax();
                });

                let classId = (await predictedClass.data())[0];
                predictedClass.dispose();
                classId = Math.floor(classId);
                const className = controlsCaptured[classId];
                toggleState(className);
                await tf.nextFrame();
            } else if(handTrackPrediction && handTrackPrediction.length > 1) {
                // more than 1 hand detected
                console.info(":: More than 1 hand detected! ::")

            } else {
                // no hand detected
                console.info(":: No hand detected! ::")
            }
        }
        donePredicting();
    }

    function predicting() {
        document.getElementById('webcam-outer-wrapper').style.border =
            '4px solid #00db8b';
    }

    function donePredicting() {
        document.getElementById('webcam-outer-wrapper').style.border =
            '2px solid #c8d0d8';
        removeActiveClass();
    }

    function removeActiveClass() {
        $('.active').removeClass('active');
    }

    function toggleState(className) {
        console.log(className);
        removeActiveClass();
        $(`.${className}`).addClass('active');
    }

    init();

})();