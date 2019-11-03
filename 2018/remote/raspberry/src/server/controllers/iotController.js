const { ledON, ledOFF, ledState } = require('../iot/iotManager');

var ledStateGET = function (req, res) {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
        var ledONOFF = ledState();
        var data = {
            status: "OK",
            "message": "LED is " + ledONOFF,
            "control": {
                "led1": true
            }
        };
        res.send(data);
        res.end();
    }
    catch (err) {
        res.status(err.status || 500);
        res.send(err);
        res.end();
    }
};

var ledStatePUT = function (req, res) {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
        let control = req.body.control;
        if (control.led1) {
            ledON();
        } else {
            ledOFF();
        }
        var ledState = ledState();
        var data = {
            status: "OK",
            "message": "LED is " + ledState,
            "control": {
                "led1": control.led1
            }
        };
        res.send(data);
        res.end();
    }
    catch (err) {
        res.status(err.status || 500);
        res.send(err);
        res.end();
    }
};

var control = function (req, res) {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
        iotService(req).
            then((result) => {
                res.send(result);
                res.end();
            }).
            catch((err) => {
                res.status(err.status || 500);
                res.send(err);
                res.end();
            });
    }
    catch (err) {
        res.status(err.status || 500);
        res.send(err);
        res.end();
    }
};

var home = function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    var data = {
        version: "001",
        status: "OK",
        "message": "Service is up and running!",
        urls: [
            {
                method: "GET",
                url: "/api/led/state",
                description: "Get current LED State"
            },
            {
                method: "PUT",
                url: "/api/led/state",
                description: "Update LED State",
                sampleBody: { control: { "led1": true } }
            }
        ]
    };
    res.send(data);
    res.end();
};

/*Module exports*/
var iotController = function () {
    return {
        home,
        control,
        ledStateGET,
        ledStatePUT
    };
};

module.exports = iotController();