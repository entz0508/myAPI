/*======================================================================================================
 @desc	route middleware - 인증처리용
 ====================================================================================================*/

// common
//require('date-utils'); // TimeDate Package
const PACKET = require("../util/packet_sender.js");
const COMMON_UTIL = require("../util/common.js");
const ERROR_CODE_UTIL = require('../util/error_code_util.js');
const HTTP_REQUEST_UTIL = require("../../common/util/http_request_util.js");

const PRINT_LOG = global.PRINT_LOGGER;

var EMPTY = function (req, res, next) {
    "use strict";
    next();
};


var DEFAULT = function (req, res, next) {
    "use strict";

    var API_PATH = req.route.path;

    var appID = null;
    var appToken = null;
    var clientIP = COMMON_UTIL.getClientIP(req);
    var os = null;
    var country = null;

    if("POST" === req.method) {
        appID = COMMON_UTIL.trim(req.body.app_id);
        appToken = COMMON_UTIL.trim(req.body.app_token);
        os = COMMON_UTIL.trim(req.body.os);
        country = COMMON_UTIL.trim(req.body.country);
    }
    else{
        appID = COMMON_UTIL.trim(req.query.app_id);
        appToken = COMMON_UTIL.trim(req.query.app_token);
        os = COMMON_UTIL.trim(req.query.os);
        country = COMMON_UTIL.trim(req.query.country);
    }

    if( !COMMON_UTIL.isValidOS(os) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : DEFAULT, RES ERROR PARAMETER, OS");
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }

    if( !COMMON_UTIL.isValidAppID(appID) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : DEFAULT, RES ERROR PARAMETER, APP_ID");
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }

    if( !COMMON_UTIL.isValidCountry(country) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : DEFAULT, RES ERROR PARAMETER, country");
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }

    next();
};


var LOGGED_IN_ACCOUNT_WITHOUT_PROFILE = function (req, res, next) {
    "use strict";
    var API_PATH = req.route.path;

    var appID = null;
    var appToken = null;
    var clientUID = null;
    var clientIP = COMMON_UTIL.getClientIP(req);
    var os = null;

    var accountID = null;
    var accessToken = null;
    var profileID = null;
    var country = null;

    var reqParam = {};

    if("POST" === req.method) {
        appID = COMMON_UTIL.trim(req.body.app_id);
        appToken = COMMON_UTIL.trim(req.body.app_token);
        clientUID = COMMON_UTIL.trim(req.body.client_uid);
        os = COMMON_UTIL.trim(req.body.os);

        accountID = COMMON_UTIL.trim(req.body.account_id);
        accessToken = COMMON_UTIL.trim(req.body.access_token);
        profileID = COMMON_UTIL.trim(req.body.pf_id);
        country = COMMON_UTIL.trim(req.body.country);

        reqParam = req.body;
    } else{
        appID = COMMON_UTIL.trim(req.query.app_id);
        appToken = COMMON_UTIL.trim(req.query.app_token);
        clientUID = COMMON_UTIL.trim(req.query.client_uid);
        os = COMMON_UTIL.trim(req.query.os);

        accountID = COMMON_UTIL.trim(req.query.account_id);
        accessToken = COMMON_UTIL.trim(req.query.access_token);
        profileID = COMMON_UTIL.trim(req.query.pf_id);
        country = COMMON_UTIL.trim(req.query.country);

        reqParam = req.query;
    }

    if( !COMMON_UTIL.isValidOS(os) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_ACCOUNT_WITHOUT_PROFILE, RES ERROR PARAMETER, OS" + JSON.stringify(reqParam));
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }
    if( !COMMON_UTIL.isValidAppID(appID) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_ACCOUNT_WITHOUT_PROFILE, RES ERROR PARAMETER, APP_ID" + JSON.stringify(reqParam));
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }

    if( !COMMON_UTIL.isValidCountry(country) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_ACCOUNT_WITHOUT_PROFILE, RES ERROR PARAMETER, country" + JSON.stringify(reqParam));
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }

    if( !COMMON_UTIL.isValidAccountID(accountID) || !COMMON_UTIL.isValidAccessToken(accessToken) ||
         !COMMON_UTIL.isValidClientUID(clientUID) || !COMMON_UTIL.isValidOS(os) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_ACCOUNT_WITHOUT_PROFILE, RES ERROR PARAMETER " + JSON.stringify(reqParam));
        PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
    } else {
        HTTP_REQUEST_UTIL.httpIsLoggedInAccountWithoutProfile(appID, clientUID, accountID, accessToken, function(err, resData){
            next();
			/*
			if (err || !resData.isLoggedIn) {
                PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_ACCOUNT_WITHOUT_PROFILE,  no login user, " + JSON.stringify(reqParam));
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_NOT_LOGIN);
            } else {
                next();
            };*/
        })
    }
};

var LOGGED_IN_ACCOUNT_WITH_PROFILE = function (req, res, next) {
    "use strict";
    var API_PATH = req.route.path;

    var appID = null;
    var appToken = null;
    var clientUID = null;
    var clientIP = COMMON_UTIL.getClientIP(req);
    var os = null;

    var accountID = null;
    var accessToken = null;
    var profileID = null;
    var country = null;

    var reqParam = {};

    if("POST" === req.method) {
        appID = COMMON_UTIL.trim(req.body.app_id);
        appToken = COMMON_UTIL.trim(req.body.app_token);
        clientUID = COMMON_UTIL.trim(req.body.client_uid);
        os = COMMON_UTIL.trim(req.body.os);

        accountID = COMMON_UTIL.trim(req.body.account_id);
        accessToken = COMMON_UTIL.trim(req.body.access_token);
        profileID = COMMON_UTIL.trim(req.body.pf_id);
        country = COMMON_UTIL.trim(req.body.country);

        reqParam = req.body;
    } else{
        appID = COMMON_UTIL.trim(req.query.app_id);
        appToken = COMMON_UTIL.trim(req.query.app_token);
        clientUID = COMMON_UTIL.trim(req.query.client_uid);
        os = COMMON_UTIL.trim(req.query.os);

        accountID = COMMON_UTIL.trim(req.query.account_id);
        accessToken = COMMON_UTIL.trim(req.query.access_token);
        profileID = COMMON_UTIL.trim(req.query.pf_id);
        country = COMMON_UTIL.trim(req.query.country);

        reqParam = req.query;

    }

    if( !COMMON_UTIL.isValidOS(os) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_ACCOUNT_WITH_PROFILE, RES ERROR PARAMETER, OS"  + JSON.stringify(reqParam));
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }
    if( !COMMON_UTIL.isValidAppID(appID) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_ACCOUNT_WITH_PROFILE, RES ERROR PARAMETER, APP_ID" + JSON.stringify(reqParam));
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }
    if( !COMMON_UTIL.isValidCountry(country) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_ACCOUNT_WITH_PROFILE, RES ERROR PARAMETER, country" + JSON.stringify(reqParam));
        PACKET.sendFail(req,res,ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
        return;
    }
	
	if(!COMMON_UTIL.isValidAccountID(accountID)) { PRINT_LOG.error(__filename, API_PATH, " accountID "); }
	if(!COMMON_UTIL.isValidAccessToken(accessToken)) { PRINT_LOG.error(__filename, API_PATH, " accessToken " + accessToken); }
	if(!COMMON_UTIL.isValidClientUID(clientUID)) { PRINT_LOG.error(__filename, API_PATH, " clientUID "); }
	if(!COMMON_UTIL.isValidOS(os)) { PRINT_LOG.error(__filename, API_PATH, " os "); }
	if(!COMMON_UTIL.isValidProfileID(profileID)) { PRINT_LOG.error(__filename, API_PATH, " profileID "); }
	
    if( !COMMON_UTIL.isValidAccountID(accountID) || !COMMON_UTIL.isValidAccessToken(accessToken) ||
        !COMMON_UTIL.isValidClientUID(clientUID) || !COMMON_UTIL.isValidOS(os) || !COMMON_UTIL.isValidProfileID(profileID) ) {
        PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_ACCOUNT_WITH_PROFILE, RES ERROR PARAMETER " + JSON.stringify(reqParam) );
        PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
    } else {
        HTTP_REQUEST_UTIL.httpIsLoggedInAccountWithProfile(appID, clientUID, accountID, accessToken, profileID, function(err, resData){
            next();
			/*
			if (err || !resData.isLoggedIn) {
                PRINT_LOG.error(__filename, API_PATH, " route_middleware : LOGGED_IN_ACCOUNT_WITH_PROFILE,  no login user, " + JSON.stringify(reqParam));
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_NOT_LOGIN);
            } else {
                next();
            }*/
        });
    }
};

module.exports = {
    EMPTY : EMPTY,
    DEFAULT : DEFAULT,
    LOGGED_IN_ACCOUNT_WITHOUT_PROFILE : LOGGED_IN_ACCOUNT_WITHOUT_PROFILE,
    LOGGED_IN_ACCOUNT_WITH_PROFILE : LOGGED_IN_ACCOUNT_WITH_PROFILE
};
