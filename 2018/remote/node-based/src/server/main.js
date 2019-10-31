let io = {};
let http = {};
let Q = require('q');
let request = require('request');
process.env.NODE_CONFIG_DIR = __dirname + '/config';
let config = require("config");
const Sleep = require('sleep');
const {
  cv
} = require('./utils');
const { startCamera } = require('./webcam/webcamDetection');
const { handDetection } = require('./handGesture/handGestureRecognition');
const { getSpeed } = require('./compute');

let READY_STATE = true;
let delta = [];
let prevFingersUp = 0;
let prevState;
let actionCounter = 0;
let hand;
let fingerNumOObj = {};

exports.run = (httpObj, ioObj) => {
  http = httpObj;
  io = ioObj;
  setupSocket();
  main();
};
function action(img, rawimg) {
  let originalResizedImg = img.copy().getRegion(new cv.Rect(100, 100, 300, 300));
  io.emit('captured-image', cv.imencode('.jpg', originalResizedImg).toString('base64'));
  hand = handDetection(img);
  if (hand) {
    io.emit('hand', true);
    let state = getSpeed(prevFingersUp, delta, hand.numFingersUp);
    fingerNumOObj[state] = fingerNumOObj[state] ? fingerNumOObj[state] + 1 : 1;
    if (actionCounter % 10 === 0) {
      let finalState = getFinalState(fingerNumOObj);
      console.log(JSON.stringify(fingerNumOObj));
      if (READY_STATE && prevState !== finalState) {
        console.log("Finger count: " + hand.numFingersUp);
        console.log("Sending State: " + finalState);
        // emit fan speed to socket
        io.emit('count', finalState);
        notifyIOTServer(finalState, 2000).then().finally(() => {
          READY_STATE = true;
          io.emit('startScan', true);

        });
        prevState = finalState;
        READY_STATE = false;
      }
      fingerNumOObj = {};
    }
    prevFingersUp = typeof hand.numFingersUp === 'number' || typeof hand.numFingersUp === 'string' ? parseInt(hand.numFingersUp) : 0;
  } else {
    io.emit('hand', false);
  }

  actionCounter++;
  return hand;
}

function getFinalState(inputObj) {
  let maxItem = {
    val: undefined,
    count: undefined
  };
  for (let item in inputObj) {
    if (!maxItem.val || inputObj[item] >= maxItem.count) {
      maxItem = { val: item, count: inputObj[item] };
    }
  }

  return maxItem.val;
}

- function transformRequestBody(state) {
  let body = {};
  switch (state) {
    case "HIGH":
      url = url + "D3/OFF?";
      break;
    case "MEDIUM":
      url = url + "D2/OFF?";
      break;
    case "LOW":
      url = url + "D1/OFF?";
      break;
    case "OFF":
      url = url + "D0/OFF?";
      break;
    default:
      url = url + "D0/OFF?";
  }
  return url;
}


function notifyIOTServer(state, alwaysDelayThisMuchTime) {
  let deferred = Q.defer();
  let url = config.get("remote").DEV;
  let body = {
    value: state
  };
  let options = {
    url,
    method: "POST",
    body,
    timeout: 1000,
    json: true,
    time: true
  };
  let delay = 0;
  console.log("Webservice trigger: " + url);
  try {
    request(options, (err, resService, bodyService) => {
      console.log("Webservice acknowledged ");
      console.log(bodyService);
      /* delay = alwaysDelayThisMuchTime ? (resService ? (alwaysDelayThisMuchTime - resService.elapsedTime) : 
      alwaysDelayThisMuchTime) : 0; */
      delay = alwaysDelayThisMuchTime ? alwaysDelayThisMuchTime : 0;
      console.log("Delaying response for : " + delay);
      setTimeout(() => {
        if (err !== null || resService.statusCode.toString() !== "200") {
          console.log("Error");
          deferred.reject({ "status": resService ? resService.statusCode : 0, "message": "Error reaching IoT server." });
        } else {
          console.log("Success");
          perJson = bodyService;
          deferred.resolve(perJson);
        }
      }, delay);
    });
  }
  catch (err) {
    console.log("Error");
    deferred.reject(err);
  }
  return deferred.promise;
}

function setupSocket() {
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });
}

function main() {
  startCamera(action);
}
