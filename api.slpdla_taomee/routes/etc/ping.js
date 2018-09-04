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
    app.post("/sdla.ping", ROUTE_MIDDLEWARE.DEFAULT, function(req, res){
        try {
            MYSQL_SLP_DLA_INFO_CONN.procPing(function(errPlatform, isPlatformSuccess){
                if(errPlatform || !isPlatformSuccess) {
                    var errPlatformResultOBJ = {};
                    errPlatformResultOBJ.msg ="Error, DB, Platform";
                    PACKET.sendJson(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, errPlatformResultOBJ);
                } else {
                    MYSQL_SLP_DLA_CONN.procPing(function(errAccount, isAccountSuccess){
                        if(errAccount || !isAccountSuccess) {
                            var errAccountResultOBJ = {};
                            errAccountResultOBJ.msg ="Error, DB, Account";
                            PACKET.sendJson(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, errAccountResultOBJ);
                        } else {
                            var resultOBJ = {};
                            PACKET.sendSuccess(req,res, resultOBJ);
                        }
                    });
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