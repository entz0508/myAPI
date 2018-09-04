// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require('../../common/util/route_middleware.js');
const PACKET     = require('../../common/util/packet_sender.js');
const COMMON_UTIL     = require('../../common/util/common.js');
const ERROR_CODE_UTIL     = require('../../common/util/error_code_util.js');

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_PLATFORM_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_PLATFORM;



function add_routes(app) {
    "use strict";


    var authApp = function(req, res, appID, apiKey, redirectURL ) {
        var API_PATH = req.route.path;
        var appToken = COMMON_UTIL.trim(req.body.app_token);
        var clientIdentifier = COMMON_UTIL.trim(req.body.client_uid);

        var clientIP = COMMON_UTIL.getClientIP(req);

        if( !COMMON_UTIL.isNumber(appID) || (0>=Number(appID)) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            return;
        }

        MYSQL_SLP_PLATFORM_CONN.procAuthApp(appID, apiKey, clientIP, function(err, results){
            if(err) {
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
            } else {
                var retV = COMMON_UTIL.getMysqlRES(results);
                if( 0 !== retV.res) {
                    PRINT_LOG.error( __filename, API_PATH, retV.msg);
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_NO_AUTH_APP_ID);
                } else {
                    var resultCode = ERROR_CODE_UTIL.RES_NO_AUTH_APP_ID;
                    var resultObj = {};
                    resultObj.app_id = "";
                    resultObj.redirect_url = "";

                    var row = results[0][0];
                    if( (0 < Number(appID)) && (0 < Number(row.APP_ID)) && (Number(appID) === Number(row.APP_ID)) ) {
                        resultCode = ERROR_CODE_UTIL.RES_SUCCESS;
                    } else {
                        resultCode = ERROR_CODE_UTIL.RES_NO_AUTH_APP_ID;
                    }

                    resultObj.app_id = row.APP_ID;
                    resultObj.app_name = row.APP_NAME;
                    resultObj.icon_url = row.ICON_URL;

                    resultObj.redirect_url = redirectURL;
                    //resultObj.api_key = apiKey;
                    //resultObj.client_ip = clientIP;
                    PACKET.sendJson(req, res, resultCode, resultObj);
                }

            }
        });
    };


    app.get('/slp.auth.app', ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res){
        var appID = COMMON_UTIL.trim(req.query.app_id);
        var appKey = COMMON_UTIL.trim(req.query.app_key);
        var redirectURL = COMMON_UTIL.trim(req.query.redirect_uri);
        authApp(req, res, appID, appKey, redirectURL);
    });

    app.post('/slp.auth.app', ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res){
        var appID = COMMON_UTIL.trim(req.body.app_id);
        var appKey = COMMON_UTIL.trim(req.body.app_key);
        var redirectURL = COMMON_UTIL.trim(req.body.redirect_uri);
        authApp(req, res, appID, appKey, redirectURL);

    });
}

exports.add_routes = add_routes;