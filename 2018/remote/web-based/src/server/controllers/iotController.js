const { iotServiceControl, iotServiceState } = require('../services/iotService');
const { CONSTANTS } = require('../common/constant');

var control = function (req, res) {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
        const state = req.body.control.led1 ? CONSTANTS.STATE.ON :  CONSTANTS.STATE.OFF;
        iotServiceControl(state).
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

var stateGET = function (req, res) {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
        //TODO: Should read query param and distinguish the urls
        iotServiceState().
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
        version: "002",
        status: "OK",
        "message": "Service is up and running!",
        urls: [
            {
                method: "POST",
                url: "/control",
                description: "Control IoT"
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
        stateGET
    };
};

module.exports = iotController();