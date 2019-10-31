var LED = {};
var on = function () {
    if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
        LED.writeSync(1); //set pin state to 1 (turn LED on)
    } else {
        LED.writeSync(0); //set pin state to 0 (turn LED off)
    }
};

var off = function () {
    LED.writeSync(0); // Turn LED off
};

var state = function() {
    if (LED.readSync() === 0) {
        return "OFF";
    } else {
        return "ON";
    }
}

var init = function(LEDobj) {
    LED = LEDobj;
}

//endregion

/*Module exports*/
var ledHandler = function () {
    return {
        ledON: on,
        ledOFF: off,
        ledState: state,
        initLED: init
    };
};

module.exports = ledHandler();