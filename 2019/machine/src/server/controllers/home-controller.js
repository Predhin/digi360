const { homeServiceGET } = require('../services/home-service');

var home = function (req, res) {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
        homeServiceGET().
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


/*Module exports*/
var homeController = function () {
    return {
        home
    };
};

module.exports = homeController();