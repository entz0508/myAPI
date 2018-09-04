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

    app.post("/sdla/episode/list", ROUTE_MIDDLEWARE.DEFAULT, function(req, res){
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

            if(!COMMON_UTIL.isValidSlpAccountID(requestParams.slpAccountID)) {
                requestParams.slpAccountID = 0;
                requestParams.slpAccountAccessToken = "";
            }

            if(!COMMON_UTIL.isValidAccessToken(requestParams.slpAccountAccessToken)) {
                requestParams.slpAccountID = 0;
                requestParams.slpAccountAccessToken = "";
            }

            MYSQL_SLP_DLA_CONN.procGetEpisodeList(requestParams, function(err, results){
                if(err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_SLP_DLA_CONN.procGetEpisodeList", err);
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                } else if(COMMON_UTIL.isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
                    PRINT_LOG.error(__filename, API_PATH, " db results is null");
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                } else {
                    var retV = COMMON_UTIL.getMysqlRES(results);
                    if(ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                        PRINT_LOG.error(__filename, API_PATH, retV.msg);
                        PACKET.sendFail(req, res, ERROR_CODE_UTIL.convertDbErrorCodeToResultCode(retV.res));
                    } else {
                        var responseOBJ = {};
                        responseOBJ.ep_list = [];

                        var len = results[0].length;
                        for(var i=0; i<len; i++) {
                            var row = results[0][i];

                            var obj = {};
                            obj.ep_id = row.EPISODE_ID;
                            obj.unity_code = row.UNITY_CODE;
                            obj.ver = row.UNITY_VER;
                            //obj.paid_type = row.PAID_TYPE;

                            var epInfo = COMMON_UTIL.getEpisodeInfo(obj.ep_id);
                            obj.title = epInfo.TITLE;
                            if( COMMON_UTIL.isNull(obj.title)) {
                                obj.title = "unknown title";
                            }
                            responseOBJ.ep_list.push(obj);
                        }
                        PACKET.sendSuccess(req, res, responseOBJ);
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