let mobilenet;
let classifier;
let video;
let label = 'Train me!!!';
let thumbsUp;
let thumbsDown;
let trainButton;

// Error probability becomes null, when the training is complete
function initiateTraining(errorProb) {
  if (errorProb == null) {
    console.log('Training Complete');
    classifier.classify(predictions);
  } else {
    console.log(errorProb);
  }
}

function predictions(error, result) {
  if (error) {
    console.error(error);
  } else {
    label = result;
    classifier.classify(predictions);
  }
}

// Onload method
function setup() {
  createCanvas(320, 270);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  // Load the image dataset
  mobilenet = ml5.featureExtractor('MobileNet');
  // Set input to webcam video
  classifier = mobilenet.classification(video);

  // Create the btns
  thumbsUp = createButton('Thumbs Up');
  thumbsUp.mousePressed(function() {
    classifier.addImage('Thumbs Up');
  });

  thumbsDown = createButton('Thumbs Down');
  thumbsDown.mousePressed(function() {
    classifier.addImage('Thumbs Down');
  });

  trainButton = createButton('train');
  trainButton.mousePressed(function() {
    classifier.train(initiateTraining);
  });
}

// Method which runs in loop
function draw() {
  background(0);
  image(video, 0, 0, 320, 240);
  fill(255);
  textSize(16);
  text(label, 10, height - 10);
}
