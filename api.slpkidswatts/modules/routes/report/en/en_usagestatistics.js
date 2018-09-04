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
        responseObj.daily = {};
        responseObj.daily.ep_p_cnt = 0;
        responseObj.daily.avr_p_time = 0;
        responseObj.learn_timezone_ratio = [0,0,0,0,0,0,0,0];
        responseObj.ep_preferred_score = [];
        return responseObj;
    };

    var getDayAverage = function(requestParams, callBack) {
        MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishUsagestatisticsDayAverage(requestParams, function(err, results) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.playCount = 0;
            resData.playTime = 0;
            if (err) {
                resData.err = err;
                resData.msg = "Failed, MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishUsagestatisticsDayAverage";
                PRINT_LOG.setErrorLog(resData.msg, err);
            } else {
                var retV = COMMON_UTIL.getMysqlRES(results);
                if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                    resData.msg = "res:" + retV.res + ", " + retV.msg;
                    PRINT_LOG.error(__filename, API_PATH, resData.msg);
                } else {
                    resData.isSuccess = true;
                    resData.playCount = Math.floor(Number(results[0][0].PLAY_CNT));
                    resData.playTime = Math.floor(Number(results[0][0].PLAY_TIME));

                }
            }
            callBack(resData);
        });
    };

    var getTimezonePlayCount = function(requestParams, responseObj, callBack) {
        MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishUsagestatisticsTimezonePlayCount(requestParams, function(err, results) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.responseObj = responseObj;
            resData.timezonList = [];
            if (err) {
                resData.err = err;
                resData.msg = "Failed, MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishUsagestatisticsDayAverage";
                PRINT_LOG.setErrorLog(resData.msg, err);
            } else {
                var retV = COMMON_UTIL.getMysqlRES(results);
                if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                    resData.isSuccess = true;
                } else {
                    resData.isSuccess = true;
                    var len = results[0].length;
                    for(var i=0; i<len; i++) {
                        var obj = {};
                        obj.hour = results[0][i].HOUR;
                        obj.cnt = Number(results[0][i].PLAY_CNT);
                        resData.timezonList.push(obj);
                    }
                }
            }
            callBack(resData);
        });
    };

    var prepareTimezon = function(responseObj, timezoneList){
        var len = timezoneList.length;
        var totalCnt = 0;
        var list = [];

        var thredCnt = 0;
        for(var i=0; i<len; i++) {
            var curCnt = 0;
            var tz = timezoneList[i];
            if( (0<i) && (0 == (i % 3)) ) {
                list.push(thredCnt);

                thredCnt = 0;
                curCnt += Number(tz.cnt);
                thredCnt += curCnt;

            } else {
                curCnt += Number(tz.cnt);
                thredCnt += curCnt;
            }
            totalCnt += curCnt;
        }
        list.push(thredCnt);

        var listLen = list.length;
        for(var idx=0; idx<listLen; idx++) {
            list[idx] = COMMON_UTIL.calcPercent(list[idx], totalCnt);
        }
        responseObj.learn_timezone_ratio = list;
        return responseObj;
    };

    var getEpisodeLikePointRank = function(requestParams, responseObjWithTimezone, callBack) {
        MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishUsagestatisticsEpisodeLikeRank(requestParams, function(err, results) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.responseObj = responseObjWithTimezone;
            if (err) {
                resData.err = err;
                resData.msg = "Failed, MYSQL_SLP_KW_ACTION_LOG_CONN.getEpisodeLikePointRank";
                PRINT_LOG.setErrorLog(resData.msg, err);
            } else {
                var retV = COMMON_UTIL.getMysqlRES(results);
                if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                    resData.isSuccess = true;
                } else {
                    resData.isSuccess = true;
                    var len = results[0].length;
                    for(var i=0; i<len; i++) {
                        var obj = {};
                        obj.ep_id = results[0][i].EPISODE_ID;
                        obj.score = Number(results[0][i].POINT);
                        obj.p_cnt = Number(results[0][i].PLAY_CNT);
                        obj.p_per = Number(results[0][i].PLAY_PER);
                        resData.responseObj.ep_preferred_score.push(obj);
                    }
                }
            }
            callBack(resData);
        });
    };

    app.post("/skw/report/english/usagestatistics", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT_WITH_PROFILE, function(req, res){
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


            getDayAverage(requestParams, function(resDataDay){
                if (COMMON_UTIL.isNull(resDataDay) || resDataDay.err || !resDataDay.isSuccess) {
                    if (resDataDay.err) {
                        PRINT_LOG.setErrorLog(resDataDay.msg, resDataDay.err);
                    }
                    PRINT_LOG.error(__filename, requestParams.API_PATH, resDataDay.msg);
                    PACKET.sendFail(req, res, resDataDay.res);
                } else {
                    var responseObj = getResponseObj();
                    responseObj.daily.ep_p_cnt = resDataDay.playCount;
                    responseObj.daily.avr_p_time = resDataDay.playTime;
                    getTimezonePlayCount(requestParams, responseObj, function(resDataTimezone){
                        if (COMMON_UTIL.isNull(resDataTimezone) || resDataTimezone.err || !resDataTimezone.isSuccess) {
                            if (resDataDay.err) {
                                PRINT_LOG.setErrorLog(resDataTimezone.msg, resDataTimezone.err);
                            }
                            PRINT_LOG.error(__filename, requestParams.API_PATH, resDataTimezone.msg);
                            PACKET.sendFail(req, res, resDataTimezone.res);
                        } else {
                            var responseObjWithTimezone = prepareTimezon(resDataTimezone.responseObj, resDataTimezone.timezonList );
                            getEpisodeLikePointRank(requestParams, responseObjWithTimezone, function(resDataRank){
                                if (COMMON_UTIL.isNull(resDataRank) || resDataRank.err || !resDataRank.isSuccess) {
                                    if (resDataDay.err) {
                                        PRINT_LOG.setErrorLog(resDataRank.msg, resDataRank.err);
                                    }
                                    PRINT_LOG.error(__filename, requestParams.API_PATH, resDataRank.msg);
                                    PACKET.sendFail(req, res, resDataRank.res);
                                } else {
                                    PACKET.sendSuccess(req, res, resDataRank.responseObj);
                                }
                            });

                        }
                    });
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

