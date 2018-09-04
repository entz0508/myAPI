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



function add_routes(app) {
    "use strict";


    var checkParams = function(API_PATH, appID, clientUID, accountEmail,pwd, signUpPath) {
        if( !COMMON_UTIL.isNumber(appID)  ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter appID" );
            return false;
        }

        if( !COMMON_UTIL.isValidClientUID(clientUID) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter clientUID" );
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

    app.post("/slp.developer.developer.login", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res){
        var API_PATH = req.route.path;
        try {
			var requestParams = {};
            requestParams.EMAIL		= COMMON_UTIL.trim(req.body.email);
            requestParams.PWD		= COMMON_UTIL.trim(req.body.pwd);
            requestParams.COMPANY	= COMMON_UTIL.trim(req.body.company);

			if( !COMMON_UTIL.isEmail(requestParams.EMAIL) ) {
				PRINT_LOG.error( __filename, API_PATH, " error parameter EMAIL" );
			}
			if( !COMMON_UTIL.isValidPassword(requestParams.PWD) ) {
				PRINT_LOG.error( __filename, API_PATH, " error parameter PWD" );
			}
			if( requestParams.COMPANY == "" ) {
				PRINT_LOG.error( __filename, API_PATH, " error parameter COMPANY" );
			}
			
			// 비밀번호를 암호화 
			requestParams.PWD = CRYPTO.createHash("sha512").update(requestParams.PWD).digest("base64");
			
			MYSQL_SLP_PLATFORM_CONN.procDeveloperLogin(requestParams, function(err, results){
				if(err) {
					PRINT_LOG.setErrorLog("Failed, MYSQL_SLP_PLATFORM_CONN.procDeveloperLogin", err);
					PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
				} else if(COMMON_UTIL.isNull(results) || (0 >= results.length) ) {
					PRINT_LOG.error(__filename, API_PATH, " db results is null");
					PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
				} else {
					
					//responseOBJ.MSG = results[0][0].MSG;
					PACKET.sendSuccess(req, res, responseOBJ);
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