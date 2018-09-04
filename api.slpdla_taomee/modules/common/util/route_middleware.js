/*======================================================================================================
 @desc	route middleware - 인증처리용
 ====================================================================================================*/

// common
//require('date-utils'); // TimeDate Package
const PACKET = require("../util/packet_sender.js");
const COMMON_UTIL = require("../util/common.js");
const ERROR_CODE_UTIL = require('../util/error_code_util.js');
const HTTP_REQUEST_UTIL = require("../../common/util/http_request_util.js");

const MYSQL_SLP_DLA_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA;
const MYSQL_SLP_DLA_INFO_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA_INFO;

const PRINT_LOG = global.PRINT_LOGGER;

var DEFAULT = function (req, res, next) {
    "use strict";

    var API_PATH = req.route.path;

    var appID = null;
    var appToken = null;
    var clientIP = COMMON_UTIL.getClientIP(req);
    var os = null;

    if("POST" === req.method) {
        appID = COMMON_UTIL.trim(req.body.app_id);
        appToken = COMMON_UTIL.trim(req.body.app_token);
        os = COMMON_UTIL.trim(req.body.os);
    }
    else{
        appID = COMMON_UTIL.trim(req.query.app_id);
        appToken = COMMON_UTIL.trim(req.query.app_token);
        os = COMMON_UTIL.trim(req.query.os);
    }

    if( !COMMON_UTIL.isValidOS(os) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : NO_AUTH_APP, RES ERROR PARAMETER, OS");
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }

    if( !COMMON_UTIL.isValidAppID(appID) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : NO_AUTH_APP, RES ERROR PARAMETER, APP_ID");
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }
    next();
};


var LOGGED_IN_USER = function (req, res, next) {
    "use strict";
    var API_PATH = req.route.path;

    var appID = null;
    var appToken = null;
    var clientUID = null;
    var clientIP = COMMON_UTIL.getClientIP(req);
    var os = null;

    var slpAccountID = null;
    var slpAccountAccessToken = null;
    var slpProfileID = null;

    if("POST" === req.method) {
        appID = COMMON_UTIL.trim(req.body.app_id);
        appToken = COMMON_UTIL.trim(req.body.app_token);
        clientUID = COMMON_UTIL.trim(req.body.client_uid);
        os = COMMON_UTIL.trim(req.body.os);

        slpAccountID = COMMON_UTIL.trim(req.body.account_id);
        slpAccountAccessToken = COMMON_UTIL.trim(req.body.account_access_token);
        slpProfileID = COMMON_UTIL.trim(req.body.pf_id);
    } else{
        appID = COMMON_UTIL.trim(req.query.app_id);
        appToken = COMMON_UTIL.trim(req.query.app_token);
        clientUID = COMMON_UTIL.trim(req.query.client_uid);
        os = COMMON_UTIL.trim(req.query.os);

        slpAccountID = COMMON_UTIL.trim(req.query.account_id);
        slpAccountAccessToken = COMMON_UTIL.trim(req.query.account_access_token);
        slpProfileID = COMMON_UTIL.trim(req.query.pf_id);

    }

    if( !COMMON_UTIL.isValidOS(os) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_USER, RES ERROR PARAMETER, OS");
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }
    if( !COMMON_UTIL.isValidAppID(appID) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_USER, RES ERROR PARAMETER, APP_ID");
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }

    if( !COMMON_UTIL.isValidSlpAccountID(slpAccountID) || !COMMON_UTIL.isValidAccessToken(slpAccountAccessToken) ||
         !COMMON_UTIL.isValidClientUID(clientUID) || !COMMON_UTIL.isValidProfileID(slpProfileID) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_USER, RES ERROR PARAMETER ");
        PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
    } else {
        HTTP_REQUEST_UTIL.httpIsLoggedInSlpAccount(appID, clientUID, slpAccountID, slpAccountAccessToken, slpProfileID, function(err, resData){
            if (err || !resData.isLoggedIn) {
                PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_USER,  no login user, app_id:" + appID + ", accountID:" + slpAccountID);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_NOT_LOGIN);
            } else {
                next();
            }
        });
    }
};

module.exports = {
    DEFAULT : DEFAULT,
    LOGGED_IN_USER : LOGGED_IN_USER
};
