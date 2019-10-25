var Q = require('q');
var request = require('request');
var config = require("config");

let getUrl = function () {
    let url = config.get("remote").DEV;
    return url;
}

var homeServiceGET = function (state) {
    let deferred = Q.defer();
    let url = getUrl();
    let options = {
        url,
        method: "GET",
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

//endregion

/*Module exports*/
var serviceInit = function () {
    return {
        homeServiceGET: homeServiceGET
    };
};

module.exports = serviceInit();