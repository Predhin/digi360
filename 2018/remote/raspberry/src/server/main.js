let io = {};
let http = {};
let app = {};
let express = {};
let Q = require('q');
let request = require('request');
let Gpio = {};
let LED = {};

process.env.NODE_CONFIG_DIR = __dirname + '/config';
const { home, ledStateGET, ledStatePUT } = require('./controllers/iotController');
const mqtt = require('mqtt');
const my_topic_name = 'predhin/feeds/switcher';
const { ledON, ledOFF, initLED } = require('./iot/iotManager');

exports.run = (httpObj, ioObj, appObj, expressObj, GpioObj, LEDObj) => {
  http = httpObj;
  io = ioObj;
  app = appObj;
  express = expressObj;
  Gpio = GpioObj;
  LED = LEDObj;
  main();
};

function setupRoute() {

  app.get("/api", home);

  app.get("/api/led/state", ledStateGET);

  app.put("/api/led/state", ledStatePUT);
}

function setUpMQTT() {
  var client = mqtt.connect('mqtts://io.adafruit.com', {
    port: 8883,
    username: 'predhin',
    password: 'bcb7f4793cb64f028ed58092cd6b647d'
  });

  client.on('connect', () => {
    client.subscribe(my_topic_name)
  });

  client.on('error', (error) => {
    console.log('MQTT Client Errored');
    console.log(error);
  });

  client.on('message', function (topic, message) {
    // Do some sort of thing here.
    // Could be GPIO related, or in my case running system commands to
    // trigger the omxplayer app to play a certain file.
    if(message.toString() === "ON") {
      ledON(LED);
    }
    if(message.toString() === "OFF") {
      ledOFF(LED);
    }

    console.log(message.toString()); // for demo purposes.
  });
}

function main() {
  initLED(LED);
  setUpMQTT();
  setupRoute();
}
