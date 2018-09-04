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

    app.post("/slp.user.account.chk.signup.path", ROUTE_MIDDLEWARE.AUTH_APP, function(req, res){
        var API_PATH = req.route.path;
        try {
            var CLIENT_IP= COMMON_UTIL.getClientIP(req);
            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientUID  = COMMON_UTIL.trim(req.body.client_uid);


            var accountEmail = COMMON_UTIL.trim(req.body.email);
            var pwd = COMMON_UTIL.trim(req.body.password);
            var signUpPath = COMMON_UTIL.trim(req.body.signup_path);


            if( !COMMON_UTIL.isNumber(appID) ||  !COMMON_UTIL.isValidClientUID(clientUID) || !COMMON_UTIL.isEmail(accountEmail) ) {
                PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            } else {
                MYSQL_SLP_ACCOUNT_CONN.procGetUserAccountSignupPath(appID, clientUID,  accountEmail,
                    function (err, results) {
                        if (err) {
                            PRINT_LOG.error(__filename, API_PATH, " procGetUserAccountSignupPath, faile db, error");
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                        } else {
                            var retV = COMMON_UTIL.getMysqlRES(results);
                            if( ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                                PRINT_LOG.error( __filename, API_PATH, retV.msg);
                                PACKET.sendFail(req, res, retV.res);
                            } else {
                                var row = results[0][0];
                                var responseObj = {};
                                responseObj.signup_path = row.SIGNUP_PATH;
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