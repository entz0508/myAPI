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
| < action_type >
|   ep_start : 에피소드 시작
|   ep_end   : 에피소드 종료
|   ch_start : 챕터 시작
|   ch_end   : 챕터 종료
|   app_bg   : APP Foreground to Background 로 전환
|   app_fg   : APP Background to Foreground 로 전환
----------------------------------------------------------------*/

function add_routes(app) {
    "use strict";

    var checkParams = function(requestParams) {
        requestParams.isSuccess = false;
        if( !COMMON_UTIL.isValidAppID(requestParams.appID) || !COMMON_UTIL.isValidClientUID(requestParams.clientUID) ||
            !COMMON_UTIL.isValidSlpAccountID(requestParams.accountID) || !COMMON_UTIL.isValidAccessToken(requestParams.accessToken) ||
            !COMMON_UTIL.isValidActionType(requestParams.actionType) ||  !COMMON_UTIL.isValidCounrtyCodeAlpha2(requestParams.countryCode)) {
            requestParams.isSuccess = false;
        } else {
            if( (COMMON_UTIL.ACTION_TYPE_EPISODE_START === requestParams.actionType) ||
                (COMMON_UTIL.ACTION_TYPE_EPISODE_END === requestParams.actionType) )  {
                if(!COMMON_UTIL.isValidEpisodeID(requestParams.episodeID)) {
                    requestParams.isSuccess = false;
                } else {
                    requestParams.isSuccess = true;
                    requestParams.chpter = "";
                    requestParams.playTime = 0;
                }
            } else if( COMMON_UTIL.ACTION_TYPE_CHAPTER_START===requestParams.actionType ) {
                if(!COMMON_UTIL.isValidEpisodeID(requestParams.episodeID) || !COMMON_UTIL.isValidEpisodeID(requestParams.chapter)) {
                    requestParams.isSuccess = false;
                } else {
                    requestParams.isSuccess = true;
                    requestParams.playTime = 0;
                }
            } else if( COMMON_UTIL.ACTION_TYPE_CHAPTER_END===requestParams.actionType ) {
                if(!COMMON_UTIL.isValidEpisodeID(requestParams.episodeID) || !COMMON_UTIL.isValidEpisodeID(requestParams.chapter) || isNaN(requestParams.playTime)) {
                    requestParams.isSuccess = false;
                } else {
                    requestParams.isSuccess = true;
                }
            } else if( (COMMON_UTIL.ACTION_TYPE_APP_BACKGROUND === requestParams.actionType) ||
                        (COMMON_UTIL.ACTION_TYPE_APP_FOREGROUND === requestParams.actionType) ) {
                requestParams.isSuccess = true;
                if(!COMMON_UTIL.isValidEpisodeID(requestParams.episodeID)) {
                    requestParams.episodeID = "";
                }
                if(!COMMON_UTIL.isValidChapter(requestParams.chapter)) {
                    requestParams.chapter = "";
                }
                if(!COMMON_UTIL.isValidPlaytime(requestParams.playTime)) {
                    requestParams.playTime = 0;
                }
            } else {
                requestParams.isSuccess = false;
            }
        }
        return requestParams;
    };


    app.post("/sdla/action/log", ROUTE_MIDDLEWARE.LOGGED_IN_USER, function(req, res){
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

            requestParams.actionType = COMMON_UTIL.trim(req.body.action_type);
            requestParams.episodeID = COMMON_UTIL.trim(req.body.ep_id); // 에피소드 플레이 중일때, Episode ID
            requestParams.chapter = COMMON_UTIL.trim(req.body.chapter);  // 에피소드 챕터 플레이 중일때, Chapter 1,2,3
            requestParams.playTime = COMMON_UTIL.trim(req.body.p_time); // ch_end 시 챕터의 플레이 시간, 분단위
            requestParams.curUnixtimeStamp = COMMON_UTIL.getUnixTimestamp();

            requestParams = checkParams(requestParams);
            if( !requestParams.isSuccess ) {
                PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            } else {
                MYSQL_SLP_KW_ACTION_LOG_CONN.procAddActionLog(requestParams, function (err, results) {
                    if (err) {
                        PRINT_LOG.error(__filename, API_PATH, " MYSQL_SLP_KW_ACTION_LOG_CONN.procAddActionLog, faile db, error");
                        PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                    } else {
                        var retV = COMMON_UTIL.getMysqlRES(results);
                        if( ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                            PRINT_LOG.error( __filename, API_PATH, retV.msg);
                            PACKET.sendFail(req, res, retV.res);
                        } else {
                            var responseObj = {};
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