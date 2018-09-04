// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_PLATFORM_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_PLATFORM;
const MYSQL_SLP_ACCOUNT_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_ACCOUNT;



function add_routes(app) {
    "use strict";


    var checkParams = function(API_PATH, appID, clientIdentifier, accountID, accessToken) {
        if( !COMMON_UTIL.isNumber(appID)  ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter appID" );
            return false;
        }

        if( !COMMON_UTIL.isValidClientUID(clientIdentifier) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter clientIdentifier" );
            return false;
        }


        if( !COMMON_UTIL.isNumber(accountID) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter accountID" );
            return false;
        }

        if( COMMON_UTIL.isNull(accessToken) ) {
            PRINT_LOG.error( __filename, API_PATH, " error parameter accessToken" );
            return false;
        }
        return true;
    };

    app.post("/slp.user.account.get.info", ROUTE_MIDDLEWARE.AUTH_APP_LOGIN_USER_ALLOW_APP, function(req, res){
        var API_PATH = req.route.path;
        try {
            var CLIENT_IP = COMMON_UTIL.getClientIP(req);

            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientIdentifier = COMMON_UTIL.trim(req.body.client_uid);

            var accountID = COMMON_UTIL.trim(req.body.account_id);
            var accessToken = COMMON_UTIL.trim(req.body.access_token);

            if( !checkParams(API_PATH, appID, clientIdentifier, accountID,accessToken) ) {
                PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            } else {
                MYSQL_SLP_ACCOUNT_CONN.procGetUserAccountWithProfileInfo(appID, clientIdentifier, CLIENT_IP, accountID, accessToken,
                    function (err, results) {
                        if (err) {
                            PRINT_LOG.error(__filename, API_PATH, " procUserAccountLogin, faile db, error");
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                        } else {
                            var retV = COMMON_UTIL.getMysqlRES(results);
                            if( ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                                PRINT_LOG.error(__filename, API_PATH, retV.msg);
                                PACKET.sendFail(req, res, retV.res);
                            } else {
                                var responseObj = {};
                                responseObj.email = results[0][0].EMAIL;
                                responseObj.account_id = results[0][0].ACCOUNT_ID;
                                responseObj.is_allow_app = results[0][0].IS_ALLOW_APP;
                                responseObj.access_token = results[0][0].ACCESS_TOKEN;
                                responseObj.country = results[0][0].COUNTRY;
                                responseObj.cur_pf_id = results[0][0].CUR_PROFILE_ID;
                                responseObj.star = results[0][0].STAR_POINT;
                                responseObj.login_type = results[0][0].LOGIN_TYPE;
                                responseObj.pf_list = [];

                                var len = results[0].length;
                                for (var i = 0; i < len; i++) {
                                    var row = results[0][i];

                                    var profile = {};
                                    profile.pf_id = row.PROFILE_ID;
                                    profile.name = row.NAME;
                                    profile.birthday = row.BIRTHDAY;
                                    profile.gender = row.GENDER;
                                    profile.limit_time = row.LIMIT_TIME;
                                    //profile.img_server_idx = row.IMG_SERVER_IDX;


                                    var path = COMMON_UTIL.getPhotosPath(0) + accountID + "/" + profile.pf_id + "/";
                                    var imgURL = row.IMG_FILE_NAME;
                                    if( COMMON_UTIL.isNull(imgURL) ) {
                                        imgURL = "";
                                        profile.img_url = "";
                                    } else {
                                        profile.img_url = path + imgURL;
                                    }

                                    var imgThURL = row.IMG_TH_FILE_NAME;
                                    if( COMMON_UTIL.isNull(imgThURL) ) {
                                        imgThURL = "";
                                        profile.img_th_url = "";
                                    } else {
                                        profile.img_th_url = path + imgThURL;
                                    }


                                    if ("y" === row.HIDDEN) {
                                        profile.hidden = 1;
                                    } else {
                                        profile.hidden = 0;
                                    }
                                    responseObj.pf_list.push(profile);
                                }
                                PACKET.sendSuccess(req, res, responseObj);
                            }
                        }
                    });
            }
        } catch(catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
}

exports.add_routes = add_routes;