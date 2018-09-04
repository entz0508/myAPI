// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../../common/util/route_middleware.js");
const PACKET     = require("../../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_KW_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_KW;

function add_routes(app) {
    "use strict";

    app.post("/skw/report/multiintelli", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT_WITHOUT_PROFILE, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.countryCode = COMMON_UTIL.trim(req.body.country);
            requestParams.appID = COMMON_UTIL.trim(req.body.app_id);
            requestParams.os = COMMON_UTIL.trim(req.body.os);
            requestParams.appToken = COMMON_UTIL.trim(req.body.app_token);
            requestParams.clientUID = COMMON_UTIL.trim(req.body.client_uid);
            requestParams.clientVer = COMMON_UTIL.trim(req.body.c_ver);

            requestParams.accountID = COMMON_UTIL.trim(req.body.account_id);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            requestParams.profileID = COMMON_UTIL.trim(req.body.pf_id);
            requestParams.curUnixtimeStamp = COMMON_UTIL.getUnixTimestamp();

            if(!COMMON_UTIL.isValidAccountID(requestParams.accountID) ||
                !COMMON_UTIL.isValidAccessToken(requestParams.accessToken) ||
                !COMMON_UTIL.isValidProfileID(requestParams.profileID) ) {
                PRINT_LOG.error(__filename, API_PATH, " error, params, AccountID:" + requestParams.accountID +
                                                        ", accessToken:" + requestParams.accessToken +
                                                        ", prfileID:" + requestParams.profileID);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }


            var responseObj = {};
            responseObj.intelli = {};
            responseObj.intelli.update_ts = 0;
            responseObj.intelli.score = [0,0,0,0,0,0,0,0,0];

            responseObj.all_intelli = {};
            responseObj.all_intelli.update_ts = 0;
            responseObj.all_intelli.score = [0,0,0,0,0,0,0,0,0];

            PACKET.sendSuccess(req, res, responseObj);

            /*
            MYSQL_SLP_KW_CONN.procRegDeviceToken(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_SLP_KW_CONN.procPhotosList", err);
                } else if (COMMON_UTIL.isNull(results) || (0 >= results.length) || (0 >= results[0].length) ) {
                    PRINT_LOG.error(__filename, API_PATH, "MYSQL_SLP_KW_CONN.procPhotosList, db results is null");
                } else {
                    var retV = COMMON_UTIL.getMysqlRES(results);
                    if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                        var msg = "res:" + retV.res + ", " + retV.msg;
                        PRINT_LOG.error(__filename, API_PATH, msg);
                        PACKET.sendFail(req, res, retV.res);
                    } else {
                        var responseObj = {};
                        PACKET.sendSuccess(req, res, responseObj);
                    }
                }
            });
            */
        } catch(catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
}

exports.add_routes = add_routes;
