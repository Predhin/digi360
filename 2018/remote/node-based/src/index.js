const express = require('express');
const app = express();
const path = require("path");
let http = require('http').Server(app);
http = require('http-shutdown')(http);
const io = require('socket.io')(http);
const { run } = require('./server/main');
const opn = require('opn');


function start() {
  cleanUp();
  setUpServer();
  run(http, io);
}

function cleanUp() {
  process.stdin.resume();//so the program will not close instantly

  function exitHandler(options, exitCode) {
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
  console.log("Setting up proxy server");

  app.use('/', express.static(__dirname + '/client'))

  // create server
  http.listen(2000, function () {
    console.log('listening on localhost:2000');
    if(process.argv.length > 2 && (process.argv[2].toLowerCase() == 'ui')){
      console.log('Opening Default Browser');
      opn('http://localhost:2000/');
    }    
  });

}

start();
