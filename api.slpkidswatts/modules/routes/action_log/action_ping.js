// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require('../../common/util/route_middleware.js');
const PACKET     = require('../../common/util/packet_sender.js');
const COMMON_UTIL     = require('../../common/util/common.js');
const ERROR_CODE_UTIL     = require('../../common/util/error_code_util.js');

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_ACCOUNT_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_ACCOUNT;
const MYSQL_SLP_ACCOUNT_PLAYLOG = global.MYSQL_CONNECTOR_POOLS.SLP_KW_PLAYLOG;

/*----------------------------------------------------------------
 | < state >
 |   menu    : 메뉴화면
 |   ep_play : 에피소드 플레이화면(챕터 플레이전)
 |   ch_play : 챕터 시작(챕터 틀레이중)
 ----------------------------------------------------------------*/
function add_routes(app) {
    "use strict";

    app.post("/sdla/action/ping", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT_WITHOUT_PROFILE, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.countryCode = COMMON_UTIL.trim(req.body.country);
            requestParams.lev = Number(global.CONFIG.SERVER_INFO.LEVEL);
            requestParams.appID = COMMON_UTIL.trim(req.body.app_id);
            requestParams.os = COMMON_UTIL.trim(req.body.os);
            requestParams.appToken = COMMON_UTIL.trim(req.body.app_token);
            requestParams.clientUID = COMMON_UTIL.trim(req.body.client_uid);
            requestParams.clientVer = COMMON_UTIL.trim(req.body.c_ver);


            requestParams.accountID = COMMON_UTIL.trim(req.body.account_id);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);
            requestParams.profileID = COMMON_UTIL.trim(req.body.profile_id);

            requestParams.actionType = COMMON_UTIL.trim(req.body.action_type);   // ep_start, ep_end, ch_start, ch_end
            requestParams.playTime = COMMON_UTIL.trim(req.body.play_time); // 챕터의 플레이 시간 분단위



            if( !COMMON_UTIL.isValidAppID(requestParams.appID) || !COMMON_UTIL.isValidClientUID(requestParams.clientUID) ||
                !COMMON_UTIL.isValidAccountID(requestParams.accountID) || !COMMON_UTIL.isValidAccessToken(requestParams.accessToken) ) {
                PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            } else {
                MYSQL_SLP_ACCOUNT_PLAYLOG.procAddActionlog(requestParams, function (err, results) {
                    if (err) {
                        PRINT_LOG.error(__filename, API_PATH, " procUserAccountAllowApp, faile db, error");
                        PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                    } else {
                        var retV = COMMON_UTIL.getMysqlRES(results);
                        if( ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                            PRINT_LOG.error( __filename, API_PATH, retV.msg);
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_INSERT_ACCOUNT_ALLOW_ACCESS_APP);
                        } else {
                            var row = results[0][0];

                            var responseObj = {};
                            responseObj.pf_id = row.PROFILE_ID;
                            responseObj.access_token = row.ACCESS_TOKEN;
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