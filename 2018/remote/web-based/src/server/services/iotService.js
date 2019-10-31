var Q = require('q');
var request = require('request');
var config = require("config");
const { CONSTANTS } = require('../common/constant');

let getControlUrl = function () {
    let url = config.get("remote").DEV + config.get("remote").TOKEN;
    return url;
}

let getStateUrl = function () {
    let url = config.get("remote").DEV + "/last" + config.get("remote").TOKEN;
    return url;
}

let getControlBody = function (state) {
    let requestBody = {};
    switch (state) {
        case CONSTANTS.STATE.ON:
            requestBody["value"] = "ON";
            break;
        case CONSTANTS.STATE.OFF:
            requestBody["value"] = "OFF";
            break;
        default:
            requestBody["value"] = "OFF";
    }
    return requestBody;
}

var iotServiceControl = function (state) {
    let deferred = Q.defer();
    let url = getControlUrl();
    let body = getControlBody(state);
    let options = {
        url,
        method: "POST",
        body,
        json: true
    };
    console.log("Webservice trigger: " + url);
    try {
        request(options, (err, resService, bodyService) => {
            if (err !== null || resService.statusCode.toString() !== "200") {
                deferred.reject({ "status": resService ? resService.statusCode : 0, "message": "Error reaching IoT server." });
            } else {
                perJson = bodyService;
                deferred.resolve(perJson);
            }
        });
    }
    catch (err) {
        deferred.reject(err);
    }
    return deferred.promise;
};

var iotServiceState = function () {
    let deferred = Q.defer();
    let url = getStateUrl();
    let options = {
        url,
        method: "GET"
    };
    console.log("Webservice trigger: " + url);
    try {
        request(options, (err, resService, bodyService) => {
            if (err !== null || resService.statusCode.toString() !== "200") {
                deferred.reject({ "status": resService ? resService.statusCode : 0, "message": "Error reaching IoT server." });
            } else {
                perJson = bodyService;
                deferred.resolve(perJson);
            }
        });
    }
    catch (err) {
        deferred.reject(err);
    }
    return deferred.promise;
};

//endregion

/*Module exports*/
var iotServiceInit = function () {
    return {
        iotServiceControl: iotServiceControl,
        iotServiceState: iotServiceState
    };
};

module.exports = iotServiceInit();