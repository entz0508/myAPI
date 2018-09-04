// nodejs npm
const CRYPTO      = require("crypto");

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


    var checkParams = function(API_PATH, appID, clientIdentifier, accountEmail,pwd, signUpPath) {
        if( !COMMON_UTIL.isNumber(appID)  ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter appID" );
            return false;
        }

        if( !COMMON_UTIL.isValidClientUID(clientIdentifier) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter clientIdentifier" );
            return false;
        }

        if( !COMMON_UTIL.isEmail(accountEmail)  ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter accountEmail" );
            return false;
        }
        if( !COMMON_UTIL.isValidPassword(pwd) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter pwd" );
            return false;
        }

        if( !COMMON_UTIL.isValidSignupPath(signUpPath) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter signUpPath" );
            return false;
        }
        return true;
    };

    app.post("/slp.user.account.login", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientUID = COMMON_UTIL.trim(req.body.client_uid);

            var accountEmail = COMMON_UTIL.trim(req.body.email);
            var pwd = COMMON_UTIL.trim(req.body.password);
            var signUpPath = COMMON_UTIL.trim(req.body.signup_path);


            if( !checkParams(API_PATH, appID, clientUID, accountEmail,pwd, signUpPath) ) {
                PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            } else {

                var accountPWD = CRYPTO.createHash("sha512").update(pwd).digest("base64");

                MYSQL_SLP_ACCOUNT_CONN.procUserAccountLogin(appID, clientUID, CLIENT_IP, accountEmail, accountPWD, signUpPath,
                    function (err, results) {
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
                                responseObj.account_id = 0;
                                responseObj.access_token = 0;
                                responseObj.is_allow_app = 0;

                                var len = results[0].length;
                                for (var i = 0; i < len; i++) {
                                    var row = results[0][i];
                                    responseObj.account_id = row.ACCOUNT_ID;
                                    responseObj.access_token = row.ACCESS_TOKEN;
                                    responseObj.is_allow_app = row.IS_ALLOW_APP;
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