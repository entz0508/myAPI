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
    app.post("/sdla.app.ver", ROUTE_MIDDLEWARE.DEFAULT, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientIdentifier = COMMON_UTIL.trim(req.body.client_uid);

            var os = COMMON_UTIL.trim(req.body.os);
            var clientVer = COMMON_UTIL.trim(req.body.c_ver);
            //var lev = COMMON_UTIL.trim(req.body.level);
            var lev = Number(global.CONFIG.SERVER_INFO.LEVEL);

            MYSQL_SLP_DLA_INFO_CONN.procGetAppVersion(os, lev, clientVer, function(err, results){
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