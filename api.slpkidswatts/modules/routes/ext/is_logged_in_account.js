// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_PLATFORM_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_PLATFORM;
const MYSQL_SLP_ACCOUNT_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_ACCOUNT;



function add_routes(app) {
    "use strict";


    var checkParams = function(API_PATH, appID, clientUID, accountID, accessToken, profileID) {
        if( !COMMON_UTIL.isNumber(appID)  ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter appID" );
            return false;
        }

        if( !COMMON_UTIL.isValidClientUID(clientUID) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter clientIdentifier" );
            return false;
        }


        if( !COMMON_UTIL.isNumber(accountID) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter accountID" );
            return false;
        }

        if( !COMMON_UTIL.isValidAccessToken(accessToken) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter accessToken" );
            return false;
        }

        if( !COMMON_UTIL.isValidProfileID(profileID) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter profileID" );
            return false;
        }
        return true;
    };

    app.post("/slp/user/account/isloggedin/with", ROUTE_MIDDLEWARE.AUTH_APP_LOGIN_USER_ALLOW_APP, function(req, res){
        var API_PATH = req.route.path;
        try {
            var CLIENT_IP = COMMON_UTIL.getClientIP(req);

            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientUID = COMMON_UTIL.trim(req.body.client_uid);

            var accountID = COMMON_UTIL.trim(req.body.account_id);
            var accessToken = COMMON_UTIL.trim(req.body.access_token);
            var profileID = COMMON_UTIL.trim(req.body.pf_id);


            if( !checkParams(API_PATH, appID, clientUID, accountID, accessToken, profileID) ) {
                PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            } else {
                MYSQL_SLP_ACCOUNT_CONN.procIsLoginUserAccountWithProfileID(appID, clientUID, accountID, accessToken, profileID, function (err, results) {
                        if (err) {
                            PRINT_LOG.error(__filename, API_PATH, " procUserAccountLogin, faile db, error");
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                        } else {
                            var retV = COMMON_UTIL.getMysqlRES(results);
                            if( ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                                PRINT_LOG.error(__filename, API_PATH, retV.msg);
                                PACKET.sendFail(req, res, retV.res);
                            } else {

                                var responseObj = {};
                                if(1 === Number(results[0][0].IS_LOGIN)) {
                                    responseObj.is_logged_in = 1;
                                } else {
                                    responseObj.is_logged_in = 0;
                                }

                                if(0 < Number(results[0][0].IS_KIDSWATTS_APP_LOGIN)) {
                                    responseObj.is_kidswatts_app_logged_in = 1;
                                } else {
                                    responseObj.is_kidswatts_app_logged_in = 0;
                                }


                                PACKET.sendSuccess(req, res, responseObj);


                            }
                        }
                    });
            }
        } catch(catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
}

exports.add_routes = add_routes;