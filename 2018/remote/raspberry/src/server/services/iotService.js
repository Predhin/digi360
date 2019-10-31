var Q = require('q');
var request = require('request');
var config = require("config");
const { CONSTANTS } = require('../common/constant');

let getControlUrl = function () {
    let url = config.get("remote").DEV;
    return url;
}

let getControlBody = function (state) {
    let requestBody = {};
    switch (state) {
        case CONSTANTS.STATE.ON:
            requestBody["relay1"] = true;
            break;
        case CONSTANTS.STATE.OFF:
            requestBody["relay1"] = false;
            break;
        default:
            requestBody["relay1"] = false;
    }
    return requestBody;
}

var iotService = function (state) {
    let deferred = Q.defer();
    let url = getControlUrl();
    let body = getControlBody(state);
    let options = {
        url,
        method: "POST",
        body
    };
    console.log("Webservice trigger: " + url);
    try {
        request(options, (err, resService, bodyService) => {
            if (err !== null || resService.statusCode.toString() !== "200") {
                deferred.reject({ "status": resService ? resService.statusCode : 0, "message": "Error reaching IoT server." });
            }
            perJson = bodyService;
            deferred.resolve(perJson);
        });
    }
    catch (err) {
        deferred.reject(err);
    }
    return deferred.promise;
};

//endregion

/*Module exports*/
var iotService = function () {
    return {
        iotService
    };
};

module.exports = iotService();