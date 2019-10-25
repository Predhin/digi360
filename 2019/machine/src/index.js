const express = require('express');
const app = express();
const path = require("path");
let http = require('http').Server(app);
http = require('http-shutdown')(http);
const io = require('socket.io')(http);
const { run } = require('./server/main');
const bodyParser = require('body-parser');
const opn = require('opn');
const reload = require('reload');
const PORT = 7000;


function start() {
  cleanUp();
  setUpServer();
  run(http, io, app, express);
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
  console.log("Setting up server");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/', express.static(__dirname + '/client'));

  // Reload code here
  reload(app).then(function (reloadReturned) {
    // reloadReturned is documented in the returns API in the README

    // Reload started, start web server
    // create server
    http.listen(PORT, function () {
      console.log('listening on localhost:7000');
      if (process.argv.length > 2 && (process.argv[2].toLowerCase() == 'ui')) {
        console.log('Opening Default Browser');
        opn('http://localhost:' + PORT);
      }
    });
  }).catch(function (err) {
    console.error('Reload could not start, could not start server/sample app', err)
  });

}

start();
