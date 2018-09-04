// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_DLA_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA;
const MYSQL_SLP_DLA_INFO_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA_INFO;


function add_routes(app) {
    "use strict";
    app.post("/sdla/app/ver", ROUTE_MIDDLEWARE.DEFAULT, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.countryCode = COMMON_UTIL.trimCountry(req.body.country);
            requestParams.appID = COMMON_UTIL.trim(req.body.app_id);
            requestParams.lev = COMMON_UTIL.convertAppIDtoLevel(requestParams.appID);
            requestParams.os = COMMON_UTIL.trim(req.body.os);
            requestParams.appToken = COMMON_UTIL.trim(req.body.app_token);
            requestParams.clientUID = COMMON_UTIL.trim(req.body.client_uid);
            requestParams.clientVer = COMMON_UTIL.trim(req.body.c_ver);


            MYSQL_SLP_DLA_INFO_CONN.procGetAppVersion(requestParams, function(err, results){
                if(err || COMMON_UTIL.isNull(results) || (0 >= results.length) || (0 >= results[0].length) ) {
                    var errPlatformResultOBJ = {};
                    errPlatformResultOBJ.msg ="Error, DB, Platform";
                    PACKET.sendJson(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, errPlatformResultOBJ);
                } else {
                    var obj = {};
                    obj.ver = results[0][0].VER;
                    if( "y" == results[0][0].SUMMIT ) {
                        obj.summit = 1;
                    } else {
                        obj.summit = 0;
                    }
                    if( "y" == results[0][0].FORCE_UPDATE ) {
                        obj.force_update = 1;
                    } else {
                        obj.force_update = 0;
                    }
                    obj.update_url = results[0][0].UPDATE_URL;
                    obj.cs_email = results[0][0].CS_EMAIL;
                    PACKET.sendSuccess(req,  res,obj );
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