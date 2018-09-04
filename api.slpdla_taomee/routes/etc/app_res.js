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

    var getResData = function(API_PATH, os, lev, clientVer, callBack) {
        MYSQL_SLP_DLA_INFO_CONN.procGetAppResData( os, lev, clientVer, function(err, results){
            var resData = {};
            resData.isSuccess = false;
            if(err) {
                resData.msg = __filename + ", " + API_PATH + ", getResData, err";
                PRINT_LOG.setErrorLog(resData.msg, err);
            } else {
                var resDataList = [];
                var len = results[0].length;
                for(var i=0; i<len; i++) {
                    var obj = {};
                    obj.id = results[0][i].ID;
                    obj.name = results[0][i].NAME;
                    obj.ver = results[0][i].VER;
                    resDataList.push(obj);
                }
                resData.isSuccess = true;
                resData.res = resDataList;
            }
            callBack(resData);
        });
    };

    var getPathInfo = function(API_PATH, os, lev, clientVer, callBack) {

        MYSQL_SLP_DLA_INFO_CONN.procGetAppResPath( os, lev, clientVer, function(err, results){
            var resData = {};
            resData.isSuccess = false;
            resData.msg = "";
            if(err) {
                resData.msg = __filename + ", " + API_PATH + ", getPathInfo, err";
                PRINT_LOG.setErrorLog(resData.msg, err);
            } else {
                var pathInfo = {};
                var len = results[0].length;
                for(var i=0; i<len; i++) {
                    var key = results[0][i].KEY;
                    pathInfo[key.toLowerCase()] = results[0][i].PATH;
                }
                resData.isSuccess = true;
                resData.pathInfo = pathInfo;
            }
            callBack(resData);
        });
    };


    app.post("/sdla.app.res", ROUTE_MIDDLEWARE.DEFAULT, function(req, res){
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


            getPathInfo(API_PATH, os, lev, clientVer, function(resPathInfo){
                if( !resPathInfo.isSuccess ) {
                    var errResOBJ = {};
                    errResOBJ.msg = resPathInfo.msg;
                    PACKET.sendJson(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, errResOBJ);
                } else {
                    getResData(API_PATH, os, lev, clientVer, function(resResData){
                        if( !resResData.isSuccess ) {
                            var errResOBJ = {};
                            errResOBJ.msg = resResData.msg;
                            PACKET.sendJson(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, errResOBJ);
                        } else {
                            var resResult = {};
                            resResult = resPathInfo.pathInfo;
                            resResult.resources = resResData.res;
                            PACKET.sendSuccess(req, res, resResult);

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