const {
  cv
} = require('../utils');
const { runVideoGeneralDetection } = require('../commons');

const webcamPort = 0;

exports.startCamera = (detectModel) => {
  runVideoGeneralDetection(webcamPort, detectModel);
}