// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");
const HTTP_REQUEST_UTIL     = require("../../common/util/http_request_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_DLA_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA;
const MYSQL_SLP_DLA_INFO_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA_INFO;


function add_routes(app) {
    "use strict";

    var loginUser = function(req, res, appID, os, clientUID, isGuest, slpAccountID, slpAccountAccessToken) {
        "use strict";

        var API_PATH = req.route.path;
        MYSQL_SLP_DLA_CONN.procLogin(appID, os, clientUID, isGuest, slpAccountID, slpAccountAccessToken, function(err, results) {
            if (err) {
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
            } else if (COMMON_UTIL.isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
                PRINT_LOG.error(__filename, API_PATH, " db results is null");
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
            } else {
                var retV = COMMON_UTIL.getMysqlRES(results);
                if (0 !== retV.res) {
                    PRINT_LOG.error(__filename, API_PATH, retV.msg);
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.convertDbErrorCodeToResultCode(retV.res));
                } else {
                    var responseOBJ = {};
                    responseOBJ.user_id = results[0][0].USER_ID;
                    responseOBJ.user_access_token = results[0][0].USER_ACCESS_TOKEN;
                    responseOBJ.slp_account_id = results[0][0].SLP_ACCOUNT_ID;
                    responseOBJ.guest = results[0][0].GUEST;
                    PACKET.sendSuccess(req, res, responseOBJ);
                }
            }
        });
    };

    app.post("/sdla.user.login", ROUTE_MIDDLEWARE.DEFAULT, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var os = COMMON_UTIL.trim(req.body.os);
            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientUID = COMMON_UTIL.trim(req.body.client_uid);
            var clientVer = COMMON_UTIL.trim(req.body.c_ver);

            var lev = Number(global.CONFIG.SERVER_INFO.LEVEL);

            var isGuest = COMMON_UTIL.trim(req.body.guest);
            var slpAccountID = COMMON_UTIL.trim(req.body.account_id);
            var slpAccountAccessToken = COMMON_UTIL.trim(req.body.account_access_token);


            if( COMMON_UTIL.isNull(clientUID) ) {
                PRINT_LOG.error(__filename, API_PATH, " error, params client_uid");
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }

            if( !COMMON_UTIL.isGuest(isGuest) ) {
                PRINT_LOG.error(__filename, API_PATH, " error, params is_guest");
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }

            isGuest = Number(isGuest);
            if(0 === isGuest) {
                if(!COMMON_UTIL.isSlpAccountID(slpAccountID)) {
                    PRINT_LOG.error(__filename, API_PATH, " error, params slp_account_id");
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                    return;
                }
                if(!COMMON_UTIL.isAccessToken(slpAccountAccessToken)) {
                    PRINT_LOG.error(__filename, API_PATH, " error, params account_auth_token");
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                    return;
                }

                HTTP_REQUEST_UTIL.httpIsLoggedInSlpAccount(appID, clientUID, slpAccountID, slpAccountAccessToken, function(err, resData){
                    if(0 !== Number(resData.res) ) {
                        PRINT_LOG.error(__filename, API_PATH, " error, " + resData.msg);
                        PACKET.sendFail(req, res, ERROR_CODE_UTIL.convertDbErrorCodeToResultCode(resData.res));
                    } else {
                        if(resData.isLoggedIn) {
                            loginUser(req, res, appID, os, clientUID, isGuest, slpAccountID, slpAccountAccessToken );
                        } else {
                            PRINT_LOG.error(__filename, API_PATH, " error, not slp account login ");
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.convertDbErrorCodeToResultCode(resData.res));
                        }
                    }
                });
            } else {
                slpAccountID = 0;
                slpAccountAccessToken = "";
                loginUser(req, res, appID, os, clientUID, isGuest, slpAccountID, slpAccountAccessToken );
            }




        } catch(catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
}

exports.add_routes = add_routes;