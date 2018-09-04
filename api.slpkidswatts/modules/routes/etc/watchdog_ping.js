// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_KW_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_KW;
const MYSQL_SLP_KW_INFO_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_KW_INFO;
const MYSQL_SLP_KW_ACTION_LOG_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_KW_ACTION_LOG;


function add_routes(app) {
    "use strict";
    app.post("/skw/watchdog/ping", ROUTE_MIDDLEWARE.DEFAULT, function(req, res){
        try {
            MYSQL_SLP_KW_INFO_CONN.procWatchdogPing(function(err, isSuccess){
                if(err || !isSuccess) {
                    var resOBJ = {};
                    resOBJ.msg ="Error, DB, Platform";
                    PACKET.sendJson(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, resOBJ);
                } else {
                    MYSQL_SLP_KW_CONN.procWatchdogPing(function(err, isSuccess){
                        if(err || !isSuccess) {
                            var resOBJ = {};
                            resOBJ.msg ="Error, DB, Account";
                            PACKET.sendJson(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, resOBJ);
                        } else {
                            MYSQL_SLP_KW_ACTION_LOG_CONN.procWatchdogPing(function(err, isSuccess){
                                if(err || !isSuccess) {
                                    var resOBJ = {};
                                    resOBJ.msg ="Error, DB, Account";
                                    PACKET.sendJson(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, resOBJ);
                                } else {
                                    var resultOBJ = {};
                                    PACKET.sendSuccess(req,res, resultOBJ);
                                }
                            });
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