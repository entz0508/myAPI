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
const MYSQL_SLP_KW_ACTION_LOG_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_KW_ACTION_LOG;

/*----------------------------------------------------------------
 | < ping state >
 |   menu    : 메뉴화면
 |   ep_play : 에피소드 플레이화면(챕터 플레이전)
 |   ch_play : 챕터 시작(챕터 틀레이중)
 ----------------------------------------------------------------*/
function add_routes(app) {
    "use strict";


    var checkParams = function(requestParams) {
        requestParams.isSuccess = false;
        if( COMMON_UTIL.PING_TYPE_MENU === requestParams.pingType ) {
            requestParams.isSuccess = true;
            requestParams.p1 = "";
            requestParams.p2 = "";
        } else if( COMMON_UTIL.PING_TYPE_EPISODE_PLAY === requestParams.pingType ) {
            if( !COMMON_UTIL.isValidEpisodeID(requestParams.p1) ) {
                requestParams.isSuccess = false;
            } else {
                requestParams.isSuccess = true;
                requestParams.p2 = "";
            }
        } else if( COMMON_UTIL.PING_TYPE_CHAPTER_PLAY === requestParams.pingType ) {
            if( !COMMON_UTIL.isValidEpisodeID(requestParams.p1) || !COMMON_UTIL.isValidChapter(requestParams.p2) ) {
                requestParams.isSuccess = false;
            } else {
                requestParams.isSuccess = true;
            }
        } else {
            requestParams.isSuccess = false;
        }
        return requestParams;
    };

    app.post("/sdla/ping/log", ROUTE_MIDDLEWARE.LOGGED_IN_USER, function(req, res){
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

            requestParams.accountID = COMMON_UTIL.trim(req.body.account_id);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.account_access_token);
            requestParams.profileID = COMMON_UTIL.trim(req.body.pf_id);

            requestParams.pingType = COMMON_UTIL.trim(req.body.p_type);
            requestParams.p1 = COMMON_UTIL.trim(req.body.p1); // p_state 가 ep_play or ch_play 일 경우 episode ID
            requestParams.p2 = COMMON_UTIL.trim(req.body.p2); // p_state 가 ch_play 일 경우 chapter Number
            requestParams.curUnixtimeStamp = COMMON_UTIL.getUnixTimestamp();

            if( !COMMON_UTIL.isValidAppID(requestParams.appID) || !COMMON_UTIL.isValidClientUID(requestParams.clientUID) ||
                !COMMON_UTIL.isValidSlpAccountID(requestParams.accountID) || !COMMON_UTIL.isValidAccessToken(requestParams.accessToken) ||
                !COMMON_UTIL.isValidPingType(requestParams.pingType) ) {
                PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            } else {
                requestParams = checkParams(requestParams);
                if( !requestParams.isSuccess ) {
                    PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                } else {
                    MYSQL_SLP_KW_ACTION_LOG_CONN.procAddPingLog(requestParams, function (err, results) {
                        if (err) {
                            PRINT_LOG.error(__filename, API_PATH, " MYSQL_SLP_KW_ACTION_LOG_CONN.procAddPingLog, faile db, error");
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                        } else {
                            var retV = COMMON_UTIL.getMysqlRES(results);
                            if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                                PRINT_LOG.error(__filename, API_PATH, retV.msg);
                                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_INSERT_ACCOUNT_ALLOW_ACCESS_APP);
                            } else {
                                var row = results[0][0];
                                var responseObj = {};
                                responseObj.p_srl = row.PING_SRL;
                                PACKET.sendSuccess(req, res, responseObj);
                            }
                        }
                    });
                }
            }
        } catch(catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
}

exports.add_routes = add_routes;