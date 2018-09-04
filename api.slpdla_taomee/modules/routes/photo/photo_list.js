// nodejs npm
const FS = require('fs');
const LWIP = require("lwip");

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_DLA_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA;

function add_routes(app) {
    "use strict";

    app.post("/sdla/photo/list", ROUTE_MIDDLEWARE.LOGGED_IN_USER, function(req, res){
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

            requestParams.slpAccountID = COMMON_UTIL.trim(req.body.account_id);
            requestParams.slpAccountAccessToken = COMMON_UTIL.trim(req.body.account_access_token);
            requestParams.profileID = COMMON_UTIL.trim(req.body.pf_id);

            requestParams.photoType  = 0;
            requestParams.episode_id = COMMON_UTIL.trim(req.body.ep_id);
            requestParams.curUnixtime = COMMON_UTIL.getUnixTimestamp();

            if(!COMMON_UTIL.isValidSlpAccountID(requestParams.slpAccountID) || !COMMON_UTIL.isValidProfileID(requestParams.profileID)) {
                PRINT_LOG.error(__filename, API_PATH, " error, params, slpAccountID:" + requestParams.slpAccountID +", profileID:" + requestParams.profileID);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }


            if(!COMMON_UTIL.isValidEpisodeID(requestParams.episode_id) ) {
                PRINT_LOG.error(__filename, API_PATH, " error, params, episodeID:" + requestParams.episode_id);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }

            MYSQL_SLP_DLA_CONN.procGetPhotosList(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_SLP_DLA_CONN.procPhotosList", err);
                } else if (COMMON_UTIL.isNull(results) || (0 >= results.length) ) {
                    PRINT_LOG.error(__filename, API_PATH, "MYSQL_SLP_DLA_CONN.procPhotosList, db results is null");
                } else {
                    var responseObj = {};
                    responseObj.photo_list = [];
                    var a = JSON.stringify(responseObj);
                    if((0 >= results[0].length)) {
                        PACKET.sendSuccess(req, res, responseObj);
                    } else {
                        var retV = COMMON_UTIL.getMysqlRES(results);
                        if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                            var msg = "res:" + retV.res + ", " + retV.msg;
                            PRINT_LOG.error(__filename, API_PATH, msg);
                            PACKET.sendFail(req, res, retV.res);
                        } else {
                            var len = results[0].length;
                            for(var i=0; i<len; i++) {
                                var obj = {};
                                obj.ep_id = results[0][i].EPISODE_ID;
                                obj.path =  COMMON_UTIL.getPhotosPath(results[0][i].DEST_PATH_IDX) + requestParams.slpAccountID + "/" + requestParams.profileID + "/";
                                obj.img_src = results[0][i].IMG_FILENAME;
                                obj.img_th = results[0][i].IMG_FILENAME_TH;
                                responseObj.photo_list.push(obj);
                            }
                            PACKET.sendSuccess(req, res, responseObj);
                        }
                    }
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
