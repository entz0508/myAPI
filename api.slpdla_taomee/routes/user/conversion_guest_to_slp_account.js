// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");
const HTTP_REQUEST_UTIL = require("../../common/util/http_request_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_DLA_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA;
const MYSQL_SLP_DLA_INFO_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA_INFO;


function add_routes(app) {
    "use strict";

    var undoConversion = function(appID, clientUID, slpAccountID, slpAccountAccessToken, userID) {
        HTTP_REQUEST_UTIL.httpUndoConversionSlpAccount(appID, clientUID, slpAccountID, slpAccountAccessToken, userID);
    };

    app.post("/sdla.account.conversion.slp", ROUTE_MIDDLEWARE.LOGGED_IN_USER, function(req, res){
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

            HTTP_REQUEST_UTIL.httpConversionSlpAccount(appID, os, clientUID, slpAccountID, slpAccountAccessToken, userID, function(errHttp, resultsHttp){
                if(errHttp) {
                    PRINT_LOG.error(__filename, API_PATH, ", error, HTTP_REQUEST_UTIL, httpConversionSlpAccount");
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_HTTP_REQUEST);
                } else {
                    if( ERROR_CODE_UTIL.RES_SUCCESS !== Number(resultsHttp.res) ) {
                        PRINT_LOG.error(__filename, API_PATH, ", res:" + resultsHttp.res + ", error, msg:" + resultsHttp.msg);
                        PACKET.sendFail(req, res, ERROR_CODE_UTIL.convertDbErrorCodeToResultCode(resultsHttp.res));
                    } else if( (appID != Number(resultsHttp.response.app_id)) ||
                                (slpAccountID != Number(resultsHttp.response.account_id)) ||
                                (userID != Number(resultsHttp.response.user_id)) ) {
                        PRINT_LOG.error(__filename, API_PATH, ", res:" + resultsHttp.res + ", error, msg:" + resultsHttp.msg);
                        PACKET.sendFail(req, res, ERROR_CODE_UTIL.convertDbErrorCodeToResultCode(resultsHttp.res));
                    } else {
                        MYSQL_SLP_DLA_CONN.procConversion(appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, function(err, results){
                            if(err) {
                                PRINT_LOG.setErrorLog("Failed, MYSQL_SLP_DLA_CONN.procConversion", err);
                                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                                undoConversion(appID, clientUID, slpAccountID, slpAccountAccessToken, userID);
                            } else if(COMMON_UTIL.isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
                                PRINT_LOG.error(__filename, API_PATH, " db results is null");
                                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                                undoConversion(appID, clientUID, slpAccountID, slpAccountAccessToken, userID);
                            } else {
                                var retV = COMMON_UTIL.getMysqlRES(results);
                                if(ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                                    PRINT_LOG.error(__filename, API_PATH, retV.msg);
                                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.convertDbErrorCodeToResultCode(retV.res));
                                    undoConversion(appID, clientUID, slpAccountID, slpAccountAccessToken, userID);
                                } else {
                                    var responseOBJ = {};
                                    responseOBJ.user_id = results[0][0].USER_ID;
                                    responseOBJ.account_id = results[0][0].SLP_ACCOUNT_ID;
                                    responseOBJ.guest = 1;
                                    if( !COMMON_UTIL.isNull(results[0][0].GUEST) && ("n"=== results[0][0].GUEST) ) {
                                        responseOBJ.guest = 0;
                                    }
                                    PACKET.sendSuccess(req, res, responseOBJ);
                                }
                            }
                        });
                    }
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