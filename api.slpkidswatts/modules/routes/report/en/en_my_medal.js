// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../../common/util/route_middleware.js");
const PACKET     = require("../../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_KW_ACTION_LOG_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_KW_ACTION_LOG;

function add_routes(app) {
    "use strict";

    var getResponseObj = function() {
        var responseObj = {};
        responseObj.update_ts = COMMON_UTIL.getUnixTimestamp();
        responseObj.t_c_m_cnt = 0; // 현재 보유 메달수
        responseObj.t_t_m_cnt = 0; // 전체 메달수

        responseObj.medal_p = {}; // 파닉스
        responseObj.medal_p.list = COMMON_UTIL.getMedalList(COMMON_UTIL.MEDAL_CATEGORY_TYPE_PHONICS);
        //PRINT_LOG.info(__filename, "MEDAL_CATEGORY_TYPE_PHONICS", JSON.stringify(responseObj.medal_p.list) );
        responseObj.medal_p.t_m_cnt = responseObj.medal_p.list.length;  // 전체 파닉스 메달수
        responseObj.medal_p.c_m_cnt = 0;

        responseObj.medal_v = {}; // 단어
        responseObj.medal_v.list = COMMON_UTIL.getMedalList(COMMON_UTIL.MEDAL_CATEGORY_TYPE_VOCABULARY);
        //PRINT_LOG.info(__filename, "MEDAL_CATEGORY_TYPE_VOCABULARY", JSON.stringify(responseObj.medal_v.list) );
        responseObj.medal_v.t_m_cnt = responseObj.medal_v.list.length; // 전체 단어 메달수
        responseObj.medal_v.c_m_cnt = 0;


        responseObj.medal_s = {}; // 문장
        responseObj.medal_s.list = COMMON_UTIL.getMedalList(COMMON_UTIL.MEDAL_CATEGORY_TYPE_SENTENCE);
        //PRINT_LOG.info(__filename, "MEDAL_CATEGORY_TYPE_SENTENCE", JSON.stringify(responseObj.medal_s.list) );
        responseObj.medal_s.t_m_cnt = responseObj.medal_s.list.length; // 전체 문장 메달수
        responseObj.medal_s.c_m_cnt = 0;

        return responseObj;
    };


    var getMedalList = function(requestParams, callBack){
        MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishMyMedalList(requestParams, function(err, results) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.medalList = [];
            if (err) {
                resData.err = err;
                resData.msg = "Failed, MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishMyMedalList";
                PRINT_LOG.setErrorLog(resData.msg, err);
            } else {
                if(COMMON_UTIL.isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
                    resData.isSuccess = true;
                } else {
                    var retV = COMMON_UTIL.getMysqlRES(results);
                    if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                        resData.msg = "res:" + retV.res + ", " + retV.msg;
                        PRINT_LOG.error(__filename, API_PATH, resData.msg);
                    } else {
                        resData.isSuccess = true;
                        var len = results[0].length;
                        for(var i=0; i<len; i++) {
                            var obj = {};
                            obj.medalID = Number(results[0][i].MEDAL_ID);
                            obj.status = Number(results[0][i].STATUS);
                            resData.medalList.push(obj);
                        }
                    }
                }
            }
            callBack(resData);
        });
    };

    var converMedalStatus = function(status) {
        if( 0 === status ) {
            return -1;
        }
        else if( 1 === status ) {
            return 1;
        }
        else if( 2 === status ) {
            return 0;
        } else {
            return -1;
        }
    };


    var prepareMedalStatus =  function( medal, medalGroup) {
        var len = medalGroup.list.length;
        for(var i=0; i<len; i++) {
            if( medal.medalID === medalGroup.list[i].id ) {
                // PRINT_LOG.info("","prepareMedalPhonics : ", JSON.stringify(medal) );
                medalGroup.list[i].status = converMedalStatus(medal.status);
                if(1 === medalGroup.list[i].status ) {
                    medalGroup.c_m_cnt++;
                }
                return medalGroup;
            }
        }
        return medalGroup;
    };

    var prepareMedal = function(medalList) {
        var responseObj =  getResponseObj();
        responseObj.t_c_m_cnt = 0; // 현재 보유 메달수
        responseObj.t_t_m_cnt = global.XML_MEDAL_LIST.length; // 전체 메달수


        var mLen = medalList.length;
        for(var mIdx=0; mIdx<mLen; mIdx++) {
            var medal = medalList[mIdx];
            if(COMMON_UTIL.isMedalTypePhonics(medal.medalID)) {
                responseObj.medal_p = prepareMedalStatus(medal, responseObj.medal_p);
            } else if(COMMON_UTIL.isMedalTypeVocabulary(medal.medalID)) {
                responseObj.medal_v = prepareMedalStatus(medal, responseObj.medal_v);
            } else if(COMMON_UTIL.isMedalTypeSentence(medal.medalID)) {
                responseObj.medal_s = prepareMedalStatus(medal, responseObj.medal_s);
            }
        }

        responseObj.t_c_m_cnt =  responseObj.medal_p.c_m_cnt +  responseObj.medal_v.c_m_cnt + responseObj.medal_s.c_m_cnt;
        return responseObj;
    };



    app.post("/skw/report/english/mymedal", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT_WITH_PROFILE, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.countryCode = COMMON_UTIL.trim(req.body.country);
            requestParams.appID = COMMON_UTIL.trim(req.body.app_id);
            requestParams.os = COMMON_UTIL.trim(req.body.os);
            requestParams.appToken = COMMON_UTIL.trim(req.body.app_token);
            requestParams.clientUID = COMMON_UTIL.trim(req.body.client_uid);
            requestParams.clientVer = COMMON_UTIL.trim(req.body.c_ver);

            requestParams.accountID = COMMON_UTIL.trim(req.body.account_id);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            requestParams.profileID = COMMON_UTIL.trim(req.body.pf_id);
            requestParams.curUnixtimeStamp = COMMON_UTIL.getUnixTimestamp();

            if(!COMMON_UTIL.isValidAccountID(requestParams.accountID) ||
                !COMMON_UTIL.isValidAccessToken(requestParams.accessToken) ||
                !COMMON_UTIL.isValidProfileID(requestParams.profileID) ) {
                PRINT_LOG.error(__filename, API_PATH, " error, params, AccountID:" + requestParams.accountID +
                    ", accessToken:" + requestParams.accessToken +
                    ", prfileID:" + requestParams.profileID);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }


            getMedalList(requestParams, function(resDataMedal){
                if (COMMON_UTIL.isNull(resDataMedal) || resDataMedal.err || !resDataMedal.isSuccess) {
                    if (resDataQuizList.err) {
                        PRINT_LOG.setErrorLog(resDataMedal.msg, resDataMedal.err);
                    }
                    PRINT_LOG.error(__filename, requestParams.API_PATH, resDataMedal.msg);
                    PACKET.sendFail(req, res, resDataMedal.res);
                } else {
                    var responseObj = prepareMedal(resDataMedal.medalList);
                    PACKET.sendSuccess(req, res, responseObj);
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
