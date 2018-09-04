// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");
const HTTP_REQUEST_UTIL = require("../../common/util/http_request_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_DLA_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA;

const MODE_USER_CREATE_SLP_ACCOUNT = 0; // SLP Account 기반 유저 생성
const MODE_USER_CREATE_GUEST = 1; // 게스트 유저 생성



function add_routes(app) {
    "use strict";

    var createUser = function( req, res, appID, clientUID, os, slpAccountID ) {
        var API_PATH = req.route.path;

        MYSQL_SLP_DLA_CONN.procCreateUser(appID, clientUID, os, slpAccountID, function(err, results){
            if(err) {
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
            } else if(COMMON_UTIL.isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
                PRINT_LOG.error(__filename, API_PATH, " db results is null");
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
            } else {
                var retV = COMMON_UTIL.getMysqlRES(results);
                if(0 !== retV.res) {
                    PRINT_LOG.error(__filename, API_PATH, retV.msg);
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.convertDbErrorCodeToResultCode(retV.res));
                } else {
                    var responseOBJ = {};
                    responseOBJ.user_id = results[0][0].USER_ID;
                    responseOBJ.slp_account_id = results[0][0].SLP_ACCOUNT_ID;
                    responseOBJ.guest = 0;
                    if("y" === results[0][0].GUEST) {
                        responseOBJ.guest = 1;
                    }

                    responseOBJ.tickets = COMMON_UTIL.prepareTicketQTY(results[0][0]);
                    PACKET.sendSuccess(req, res, responseOBJ);
                }
            }
        });
    };


    app.post("/sdla.user.create", ROUTE_MIDDLEWARE.DEFAULT, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var os = COMMON_UTIL.trim(req.body.os);
            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientUID = COMMON_UTIL.trim(req.body.client_uid);
            var clientVer = COMMON_UTIL.trim(req.body.c_ver);

            var lev = Number(global.CONFIG.SERVER_INFO.LEVEL);

            var isGuest = COMMON_UTIL.trim(req.body.guest);

            var slpAccountID = COMMON_UTIL.trim(req.body.account_id);
            var slpAccountAccessToken = COMMON_UTIL.trim(req.body.account_access_token);


            var mode = Number(isGuest);
            if( MODE_USER_CREATE_GUEST === mode) {
                createUser(req,res,appID,clientUID,os,0);
            } else if(MODE_USER_CREATE_SLP_ACCOUNT === mode) {
                if( !COMMON_UTIL.isValidSlpAccountID(slpAccountID) || !COMMON_UTIL.isValidAccessToken(slpAccountAccessToken)) {
                    PRINT_LOG.error(__filename, API_PATH, ", error, slpAccountID, slpAccountAccessToken");
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                } else {
                    HTTP_REQUEST_UTIL.httpIsLoggedInSlpAccount(appID, clientUID, slpAccountID, slpAccountAccessToken, function(err, resData){
                        if(err) {
                            PRINT_LOG.error(__filename, API_PATH, ", error, HTTP_REQUEST_UTIL.httpIsLoggedInSlpAccount");
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_HTTP_REQUEST);
                        } else {
                            if(ERROR_CODE_UTIL.RES_SUCCESS !== Number(resData.res) ) {
                                PRINT_LOG.error(__filename, API_PATH, resData.msg);
                                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_HTTP_REQUEST);
                            } else {
                                if( resData.isLoggedIn ) {
                                    createUser(req, res, appID, clientUID, os, slpAccountID);
                                } else {
                                    PRINT_LOG.error(__filename, API_PATH, resData.msg);
                                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_NOT_LOGIN);
                                }

                            }
                        }
                    } );
                }
            } else {
                PRINT_LOG.error(__filename, API_PATH, " error, is_guest");
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            }

        } catch(catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
}

exports.add_routes = add_routes;