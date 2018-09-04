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
    app.post("/slp.user.account.profile.edit", ROUTE_MIDDLEWARE.AUTH_APP_LOGIN_ACCOUNT_WITH_PROFILE, function(req, res){
        var API_PATH = req.route.path;
        try {
            var requestPrams = {};
            requestPrams.CLIENT_IP = COMMON_UTIL.getClientIP(req);
            requestPrams.appID = COMMON_UTIL.trim(req.body.app_id);
            requestPrams.appToken = COMMON_UTIL.trim(req.body.app_token);
            requestPrams.clientUID = COMMON_UTIL.trim(req.body.client_uid);

            requestPrams.accountID = COMMON_UTIL.trim(req.body.account_id);
            requestPrams.accessToken = COMMON_UTIL.trim(req.body.access_token);
            requestPrams.profileID = COMMON_UTIL.trim(req.body.pf_id);
            requestPrams.profileName = COMMON_UTIL.trim(req.body.name);
            requestPrams.profileBirthday = COMMON_UTIL.trim(req.body.birthday);
            requestPrams.profileGender = COMMON_UTIL.trim(req.body.gender);


            if( !COMMON_UTIL.isNumber(requestPrams.appID) || !COMMON_UTIL.isValidClientUID(requestPrams.clientUID) ||
                !COMMON_UTIL.isNumber(requestPrams.accountID) || !COMMON_UTIL.isValidProfileName(requestPrams.profileName) ||
                !COMMON_UTIL.isValidDate(requestPrams.profileBirthday) || !COMMON_UTIL.isValidGender(requestPrams.profileGender) ||
                !COMMON_UTIL.isValidAccessToken(requestPrams.accessToken) || !COMMON_UTIL.isValidProfileID(requestPrams.profileID)  ) {
                PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            } else {
                MYSQL_SLP_ACCOUNT_CONN.procProfileEdit(requestPrams, function (err, results) {
                        if (err) {
                            PRINT_LOG.error(__filename, API_PATH, " procProfileAdd, faile db, error");
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                        }  else {
                            var retV = COMMON_UTIL.getMysqlRES(results);
                            if( ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                                PRINT_LOG.error( __filename, API_PATH, retV.msg);
                                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_INSERT_ACCOUNT_ALLOW_ACCESS_APP);
                            } else {
                                var row = results[0][0];
                                var responseObj = {};
                                responseObj.pf_id = row.PROFILE_ID;
                                responseObj.name = row.NAME;
                                responseObj.birthday = row.BIRTHDAY;
                                responseObj.gender = row.GENDER;
                                responseObj.limit_time = row.LIMIT_TIME;

                                if ("y" === row.HIDDEN) {
                                    responseObj.hidden = 1;
                                } else {
                                    responseObj.hidden = 0;
                                }

                                var path = COMMON_UTIL.getPhotosPath(0) + requestPrams.accountID + "/" + responseObj.pf_id + "/";
                                var imgURL = row.IMG_FILE_NAME;
                                if( COMMON_UTIL.isNull(imgURL) ) {
                                    responseObj.img_url = "";
                                } else {
                                    responseObj.img_url = path + imgURL;
                                }
                                var imgThURL = row.IMG_TH_FILE_NAME;
                                if( COMMON_UTIL.isNull(imgThURL) ) {
                                    responseObj.img_th_url = "";
                                } else {
                                    responseObj.img_th_url = path + imgThURL;
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