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


    var checkParams = function(requestParams) {
        if( !COMMON_UTIL.isNumber(requestParams.appID)  ) {
            PRINT_LOG.error( __filename, requestParams.API_PATH, " error parameter appID" );
            return false;
        }

        if( !COMMON_UTIL.isValidClientUID(requestParams.clientUID) ) {
            PRINT_LOG.error( __filename, requestParams.API_PATH, " error parameter clientIdentifier" );
            return false;
        }


        if( !COMMON_UTIL.isNumber(requestParams.accountID) ) {
            PRINT_LOG.error( __filename, requestParams.API_PATH, " error parameter accountID" );
            return false;
        }

        if( COMMON_UTIL.isNull(requestParams.accessToken) ) {
            PRINT_LOG.error( __filename, requestParams.API_PATH, " error parameter accessToken" );
            return false;
        }
        return true;
    };

    app.post("/slp.user.account.secession", ROUTE_MIDDLEWARE.AUTH_APP_LOGIN_ACCOUNT_WITHOUT_PROFILE, function(req, res){
        var API_PATH = req.route.path;
        try {
            var CLIENT_IP = COMMON_UTIL.getClientIP(req);

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

            requestParams.accountID = COMMON_UTIL.trim(req.body.account_id);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);
            requestParams.curUnixtime = COMMON_UTIL.getUnixTimestamp();


            if( !checkParams(requestParams) ) {
                PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            } else {
                MYSQL_SLP_ACCOUNT_CONN.procAccountSecession(requestParams, function (err, results) {
                        if (err) {
                            PRINT_LOG.error(__filename, API_PATH, " procAccountSecession, faile db, error");
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                        } else {
                            var retV = COMMON_UTIL.getMysqlRES(results);
                            if( ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                                PRINT_LOG.error(__filename, API_PATH, retV.msg);
                                PACKET.sendFail(req, res, retV.res);
                            } else {
                                var responseObj = {};
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