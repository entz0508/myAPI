// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;


var ConsumeApple = require("./shop_consume_apple.js");
const CONSUME_APPLE  = new ConsumeApple();
var ConsumeGoogle = require("./shop_consume_google.js");
const CONSUME_GOOGLE  = new ConsumeGoogle();

function add_routes(app) {
    "use strict";

    var consume = function(API_PATH,appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, build, store, packageID, receipt, signature, callBack) {
        if("google"===store) {
            CONSUME_GOOGLE.consume(API_PATH,appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, build, store, packageID, receipt, signature,callBack);
        } else if("apple"===store) {
            CONSUME_APPLE.consume(API_PATH,appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, build, store, packageID, receipt, callBack);
        } else {
            var resData = {};
            resData.isSuccess = false;
            resData.msg = "unknown store";
            callBack(resData);
        }
    };


    app.post("/sdla.shop.buy.consume", ROUTE_MIDDLEWARE.LOGGED_IN_USER, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var os = COMMON_UTIL.trim(req.body.os);
            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientUID = COMMON_UTIL.trim(req.body.client_uid);
            var clientVer = COMMON_UTIL.trim(req.body.c_ver);

            var lev = Number(global.CONFIG.SERVER_INFO.LEVEL);

            var slpAccountID = COMMON_UTIL.trim(req.body.account_id);
            var slpAccountAccessToken = COMMON_UTIL.trim(req.body.account_access_token);
            var userID = COMMON_UTIL.trim(req.body.user_id);
            var userAccessToken = COMMON_UTIL.trim(req.body.user_access_token);
            var store = COMMON_UTIL.trim(req.body.store);
            var build = COMMON_UTIL.trim(req.body.store);
            var packageID = COMMON_UTIL.trim(req.body.package_id);
            var receipt = COMMON_UTIL.trim(req.body.receipt);
            var signature = COMMON_UTIL.trim(req.body.signature);


            if( !COMMON_UTIL.isValidStore(store) ) {
                PRINT_LOG.error(__filename, API_PATH, "error params, store:" + store);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }

            if( !COMMON_UTIL.isValidPackageID(store, packageID) ) {
                PRINT_LOG.error(__filename, API_PATH, "error params, store:" + store + ", packageID:" + packageID);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }

            if( !COMMON_UTIL.isValidBuild(build) ) {
                PRINT_LOG.error(__filename, API_PATH, "error params, build:" + build);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }

            if( COMMON_UTIL.isNull(receipt) ) {
                PRINT_LOG.error(__filename, API_PATH, "error params, receipt:" + receipt);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }

            if( ("google"===store) && COMMON_UTIL.isNull(signature) ) {
                PRINT_LOG.error(__filename, API_PATH, "error params, signature:" + signature);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            } else {
                signature = "";
            }

            consume(API_PATH,appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, build, store, packageID, receipt, signature, function(resData) {
                if (resData.isSuccess) {
                    var responseObj = {};
                    responseObj.buy_id = resData.buy_id;
                    responseObj.tickets = resData.tickets;
                    PACKET.sendSuccess(req, res, responseObj);
                } else {
                    PACKET.sendFail(req, res, resData.res);
                }
            });

        } catch(catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
}

exports.add_routes = add_routes;