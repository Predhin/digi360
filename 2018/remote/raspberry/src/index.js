const express = require('express');
const app = express();
const path = require("path");
let http = require('http').Server(app);
http = require('http-shutdown')(http);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
/*const LED = {
  readSync() {
    return 1;
  }
}
const Gpio = {};*/
const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
const { run } = require('./server/main');



function start() {
  cleanUp();
  setUpServer();
  run(http, io, app, express, Gpio, LED);
}

function freeUpResources() {
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
}

function cleanUp() {
  process.stdin.resume();//so the program will not close instantly

  function exitHandler(options, exitCode) {
    freeUpResources();
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
    // shutdown the server.
    http.shutdown(function () {
      console.log('Everything is cleanly shutdown.');
    });
  }

  //do something when app is closing
  process.on('exit', exitHandler.bind(null, { cleanup: true }));

  //catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

  //catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}

function setUpServer() {
  console.log("Setting up server");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/', express.static(__dirname + '/client'));
  // create server
  http.listen(8000, function () {
    console.log('listening on localhost:8000');
  });

}

start();
