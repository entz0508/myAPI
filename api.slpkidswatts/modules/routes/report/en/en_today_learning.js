// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../../common/util/route_middleware.js");
const PACKET     = require("../../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_KW_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_KW;
const MYSQL_SLP_KW_ACTION_LOG_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_KW_ACTION_LOG;

function add_routes(app) {
    "use strict";

    var getUnitObj = function() {
        var unit = {};
        unit.step_id = 0;
        unit.type = 0; // 0:영어 에피소드, 1:영어퀴즈
        unit.ep_id = "";
        unit.q_g_srl = 0;
        unit.begin_ts = 0;
        unit.p_time = 0;
        unit.prog_per = 0;
        unit.quiz_list=[];

        unit.p_r_per = 0; // Phonics 정답률
        unit.v_r_per = 0; // Vocabulary 정답률
        unit.s_r_per = 0; // Sentence 정답률
        unit.t_r_per = 0; // Total 정답률

        unit.medal_list = []; // 획득한 메달 ID 목록
        unit.m_p_cnt = 0;  // Phonics 메달수
        unit.m_v_cnt = 0;   // Vocabulary 메달수
        unit.m_s_cnt = 0;   // Sentence 메달수
        unit.prog_per = 0;  // 학습 진행률
        return unit;
    };


    var getReportEnglishTodayLearningForEpisode = function(requestParams, callBack) {
        MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishTodayLearningForEnglish(requestParams, function(err, results) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.units = [];
            if (err) {
                resData.isSuccess = false;
                resData.res = -1;
                resData.err = err;
                resData.msg = "Failed, MYSQL_SLP_KW_CONN.procGetReportEnglishTodayLearningForEnglish";
            } else if (COMMON_UTIL.isNull(results) || (0 >= results.length) ) {
                resData.isSuccess = false;
                resData.res = -1;
                resData.msg = "MYSQL_SLP_KW_CONN.procGetReportEnglishTodayLearningForEnglish, db results is null";
            } else {
                if(0 >= results[0].length) {
                    resData.isSuccess = true;
                } else {
                    var retV = COMMON_UTIL.getMysqlRES(results);
                    if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                        resData.isSuccess = false;
                        resData.res = retV.res;
                        resData.err = retV.err;
                        resData.msg = "res:" + retV.res + ", " + retV.msg;
                    } else {
                        var len = results[0].length;
                        for(var i=0; i<len; i++) {
                            if(0 >= results[0][i].LOG_COUNT) {
                                break;
                            } else {
                                var row = results[0][i];
                                var unit = getUnitObj();
                                unit.type = COMMON_UTIL.UNIT_TYPE_ENGLISH; // 0:영어 에피소드, 1:영어퀴즈
                                unit.ep_id = row.EPISODE_ID; // EPISODE ID

                                var epStepID = COMMON_UTIL.getEpisodeStepID(unit.ep_id);
                                if( COMMON_UTIL.isNull(epStepID)) {
                                    PRINT_LOG.error(__filename, API_PATH,"NOT found Episode, episode ID:" + unit.ep_id);
                                } else {
                                    unit.step_id = epStepID;

                                    unit.begin_ts = Number(row.BEGIN_TS); // 에피소드 시작 시간
                                    unit.p_time = Number(row.PLAY_TIME); // 플레이시간, 분단위
                                    unit.prog_per = 50; // 진행률
                                    if(1 === Number(row.END) ) {
                                        unit.prog_per = 100;
                                    }
                                    resData.units.push(unit);
                                }
                            }
                        }
                        resData.isSuccess = true;
                    }
                }
            }
            callBack(resData);
        });
    };

    var getReportEnglishTodayLearningForQuizGroup = function(requestParams, units, callBack) {
        var len = units.length;
        var beginTS = 0;
        if( 0 < len ) {
            beginTS = units[0].begin_ts;
        }

        MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishTodayLearningForQuizGroup(requestParams, beginTS, function(err, results) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.units = units;
            resData.groupList = [];
            if (err) {
                resData.isSuccess = false;
                resData.res = -1;
                resData.err = err;
                resData.msg = "Failed, MYSQL_SLP_KW_CONN.procGetReportEnglishTodayLearningForQuizGroup";
                PRINT_LOG.setErrorLog(resData.msg, err);
            } else if (COMMON_UTIL.isNull(results) || (0 >= results.length) ) {
                resData.isSuccess = false;
                resData.res = -1;
                resData.err = err;
                resData.msg = "MYSQL_SLP_KW_CONN.procGetReportEnglishTodayLearningForQuizGroup, db results is null";
                PRINT_LOG.error(__filename, requestParams.API_PATH, resData.msg);
            } else {
                if(0 >= results[0].length) {
                    resData.isSuccess = true;
                } else {
                    var retV = COMMON_UTIL.getMysqlRES(results);
                    if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                        resData.isSuccess = false;
                        resData.err = err;
                        resData.res = retV.res;
                        resData.msg = "res:" + retV.res + ", " + retV.msg;
                        PRINT_LOG.error(__filename, requestParams.API_PATH, resData.msg);
                    } else {
                        var len = results[0].length;
                        for(var i=0; i<len; i++) {
                            if(0 >= results[0][i].LOG_COUNT) {
                                break;
                            } else {
                                var obj = {};
                                obj.quizGroupSRL = results[0][i].QUIZ_GROUP_SRL;
                                obj.beginTS = results[0][i].BEGIN_TS;
                                resData.groupList.push(obj);
                            }
                        }
                        resData.isSuccess = true;
                    }
                }
            }
            callBack(resData);
        });
    };


    var getQuizInfoList = function(requestParams, units, quizGroupList, callBack) {
        if( 0 >= quizGroupList.length ) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.isSuccess = true;
            resData.res = 0;
            resData.units = units;
            resData.quizGroupList = quizGroupList;
            resData.quizInfoList = [];
            callBack(resData);
        } else {
            MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishTodayLearningQuizList(requestParams, quizGroupList[0].beginTS, function(err, results) {
                var resData = COMMON_UTIL.getResDataObj();
                resData.units = units;
                resData.quizGroupList = quizGroupList;
                resData.quizInfoList = [];
                if (err) {
                    resData.res = ERROR_CODE_UTIL.RES_FAILED_DB;
                    resData.err = err;
                    resData.msg = "Failed, MYSQL_SLP_KW_CONN.procGetReportEnglishTodayLearningQuizInfo";
                    PRINT_LOG.setErrorLog(resData.msg, err);
                } else {
                    var retV = COMMON_UTIL.getMysqlRES(results);
                    if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                        resData.res = retV.res;
                        resData.units = units;
                        resData.err = retV.err;
                        resData.msg = "res:" + retV.res + ", " + retV.msg;
                        PRINT_LOG.error(__filename, requestParams.API_PATH, resData.msg);
                    } else {
                        var len = results[0].length;
                        for ( var i=0; i<len; i++) {
                            var row = results[0][i];
                            var quizObj = {};
                            quizObj.stepID = row.STEP_ID;
                            quizObj.groupSRL = row.GROUP_SRL;
                            quizObj.quizID = row.QUIZ_ID;
                            quizObj.result = row.RESULT;
                            quizObj.beginTS = row.BEGIN_TS;
                            resData.quizInfoList.push(quizObj);
                        }
                        resData.isSuccess = true;
                    }
                }
                callBack(resData);
            });
        }
    };

    var prepareQuizList = function(resUnits, resQuizGroupList, resQuizInfoList ) {
        var groupLen = resQuizGroupList.length;
        for(var groupIDX=0; groupIDX<groupLen; groupIDX++) {
            var quizGroupSRL = resQuizGroupList[groupIDX].quizGroupSRL;

            var infoLen = resQuizInfoList.length;
            if(0 < infoLen) {
                var quizUnit = prepareQuizInfo(quizGroupSRL, resQuizInfoList);
                resUnits.push(quizUnit);
            }
        }
        return resUnits;
    };

    var prepareQuizInfo = function(quizGroupSRL, resQuizInfoList) {
        var infoLen = resQuizInfoList.length;
        var unit = getUnitObj();

        var quizResult = {};
        quizResult.phonics = {};
        quizResult.phonics.yes =0;
        quizResult.phonics.no =0;

        quizResult.vocabulary = {};
        quizResult.vocabulary.yes =0;
        quizResult.vocabulary.no =0;

        quizResult.sentence = {};
        quizResult.sentence.yes =0;
        quizResult.sentence.no =0;

        var init = false;
        for(var i=0; i<infoLen; i++) {
            var infoObj = resQuizInfoList[i];
            if (quizGroupSRL == infoObj.groupSRL) {
                if (!init) {
                    init = true;
                    unit.step_id = infoObj.stepID;
                    unit.type = COMMON_UTIL.UNIT_TYPE_QUIZ;
                    unit.ep_id = infoObj.quizID;
                    unit.q_g_srl = infoObj.groupSRL;
                    unit.begin_ts = infoObj.beginTS;
                    unit.p_time = 0;
                    unit.prog_per = 0;
                }

                var quizInfoObj = {};
                quizInfoObj.id = infoObj.quizID;
                quizInfoObj.result = infoObj.result;
                unit.quiz_list.push(quizInfoObj);

                var yes = 0;
                var no = 0;
                if(1 == quizInfoObj.result) {
                    yes = 1;
                } else {
                    no = 1;
                }

                if (COMMON_UTIL.isQuizTypePhonics(quizInfoObj.id)) {
                    quizResult.phonics.yes += yes;
                    quizResult.phonics.no += no;
                } else if (COMMON_UTIL.isQuizTypeVocabulary(quizInfoObj.id)) {
                    quizResult.vocabulary.yes += yes;
                    quizResult.vocabulary.no += no;
                } else if (COMMON_UTIL.isQuizTypeSentence(quizInfoObj.id)) {
                    quizResult.sentence.yes += yes;
                    quizResult.sentence.no += no;
                }
            }
        }

        var sumPhonics = quizResult.phonics.yes + quizResult.phonics.no;
        if( 0 < sumPhonics ) {
            unit.p_r_per = COMMON_UTIL.calcPercent(quizResult.phonics.yes, sumPhonics); // Phonics 정답률
        }

        var sumVocabulary = quizResult.vocabulary.yes + quizResult.vocabulary.no;
        if( 0 < sumVocabulary ) {
            unit.v_r_per = COMMON_UTIL.calcPercent(quizResult.vocabulary.yes, sumVocabulary); // Vocabulary 정답률
        }

        var sumSentence = quizResult.sentence.yes + quizResult.sentence.no;
        if( 0 < sumSentence ) {
            unit.s_r_per = COMMON_UTIL.calcPercent(quizResult.sentence.yes, sumSentence); // Sentence 정답률
        }
        unit.t_r_per = COMMON_UTIL.calcDiv(unit.p_r_per + unit.v_r_per + unit.s_r_per, 3); // Total 정답률

        return unit;
    };


    var getMedalList = function(requestParams, units, quizGroupList, callBack) {
        if( 0 >= quizGroupList.length ) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.isSuccess = true;
            resData.res = 0;
            resData.units = units;
            resData.quizGroupList = quizGroupList;
            resData.medalList = [];
            callBack(resData);
        } else {
            MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishTodayLearningMedalList(requestParams, quizGroupList[0].beginTS, function(err, results) {
                var resData = COMMON_UTIL.getResDataObj();
                resData.units = units;
                resData.quizGroupList = quizGroupList;
                resData.medalList = [];
                if (err) {
                    resData.res = ERROR_CODE_UTIL.RES_FAILED_DB;
                    resData.err = err;
                    resData.msg = "Failed, MYSQL_SLP_KW_CONN.procGetReportEnglishTodayLearningMedalList";
                    PRINT_LOG.setErrorLog(resData.msg, err);
                } else {
                    if( 0 >= results[0].length ) {
                        resData.isSuccess = true;
                    } else {
                        var retV = COMMON_UTIL.getMysqlRES(results);
                        if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                            resData.res = retV.res;
                            resData.err = retV.err;
                            resData.msg = "res:" + retV.res + ", " + retV.msg;
                            PRINT_LOG.error(__filename, requestParams.API_PATH, resData.msg);
                        } else {
                            var len = results[0].length;
                            for ( var i=0; i<len; i++) {
                                var row = results[0][i];
                                var medalObj = {};
                                medalObj.groupSRL = row.QUIZ_GROUP_SRL;
                                medalObj.stepID = row.SETP_ID;
                                medalObj.medalID = row.MEDAL_ID;
                                medalObj.status = row.STATUS;
                                medalObj.beginTS = row.BEGIN_TS;
                                resData.medalList.push(medalObj);
                            }
                            resData.isSuccess = true;
                        }
                    }
                }
                callBack(resData);
            });
        }
    };

    var prepareMedal = function(resUnits, medalList) {
        var groupLen = resUnits.length;
        for(var idx=0; idx<groupLen; idx++) {
            if( 1 == resUnits[idx].type ) {
                var quizGroupSRL = resUnits[idx].q_g_srl;
                if(0 < medalList.length) {
                    prepareMedalInfo(resUnits, idx, quizGroupSRL, medalList);
                }
            }
        }
        return resUnits;
    };

    var prepareMedalInfo = function(resUnits, idx, quizGroupSRL, medalList) {
        var len = medalList.length;

        for(var i=0; i<len; i++) {
            var medal = medalList[i];
            if( quizGroupSRL == medal.groupSRL ) {
                resUnits[idx].medal_list.push(medal.medalID);
                if( COMMON_UTIL.isMedalTypePhonics(medal.medalID)) {
                    resUnits[idx].m_p_cnt++;
                } else if( COMMON_UTIL.isMedalTypeVocabulary(medal.medalID)) {
                    resUnits[idx].m_v_cnt++;
                } else if( COMMON_UTIL.isMedalTypeSentence(medal.medalID)) {
                    resUnits[idx].m_s_cnt++;
                }
            }
        }
    };


    var prepareResponseObj = function(responseUnits) {
        var responseObj = {};
        responseObj.update_ts = COMMON_UTIL.getUnixTimestamp();
        responseObj.t_p_time = 0; // 총 플레이시간
        responseObj.t_p_cnt = 0; // 총 플레이 횟수
        responseObj.t_q_cnt = 0; // 오늘의 총 문항수
        responseObj.t_q_r_y = 0; // 정답 문항수
        responseObj.t_q_r_n = 0; // 오답 문항수

        var len = responseUnits.length;
        for(var i=0; i<len; i++) {
            responseObj.t_p_time += responseUnits[i].p_time;
            if( COMMON_UTIL.UNIT_TYPE_ENGLISH == responseUnits[i].type) {
                responseObj.t_p_cnt++;
            }
            else if( COMMON_UTIL.UNIT_TYPE_QUIZ == responseUnits[i].type) {
                var qLen = responseUnits[i].quiz_list.length;

                responseObj.t_q_cnt += qLen;
                if(0 < qLen) {
                    for(var qi=0; qi<qLen; qi++) {
                        if( 1 == responseUnits[i].quiz_list[qi].result ) {
                            responseObj.t_q_r_y++;
                        }
                        else if( 0== responseUnits[i].quiz_list[qi].result ) {
                            responseObj.t_q_r_n++;
                        }
                    }
                }
            }
        }

        responseObj.units = responseUnits;
        return responseObj;
    };

    app.post("/skw/report/english/todaylearning", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT_WITH_PROFILE, function(req, res){
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

            if(!COMMON_UTIL.isValidAccountID(requestParams.accountID) ||  !COMMON_UTIL.isValidAccessToken(requestParams.accessToken) ||
                !COMMON_UTIL.isValidProfileID(requestParams.profileID) ) {
                PRINT_LOG.error(__filename, API_PATH, " error, params, AccountID:" + requestParams.accountID +
                                                        ", accessToken:" + requestParams.accessToken +
                                                        ", prfileID:" + requestParams.profileID);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }


            getReportEnglishTodayLearningForEpisode(requestParams, function (resDataEnglish) {
                if (COMMON_UTIL.isNull(resDataEnglish) || resDataEnglish.err || !resDataEnglish.isSuccess) {
                    if (resDataEnglish.err) {
                        PRINT_LOG.setErrorLog(resDataEnglish.msg, resDataEnglish.err);
                    }
                    PRINT_LOG.error(__filename, requestParams.API_PATH, resDataEnglish.msg);
                    PACKET.sendFail(req, res, resDataEnglish.res);
                } else {
                    getReportEnglishTodayLearningForQuizGroup(requestParams, resDataEnglish.units, function (resDataQuizGroup) {
                        if (COMMON_UTIL.isNull(resDataQuizGroup) || resDataQuizGroup.err || !resDataQuizGroup.isSuccess) {
                            if (resDataQuizGroup.err) {
                                PRINT_LOG.setErrorLog(resDataQuizGroup.msg, resDataQuizGroup.err);
                            }
                            PRINT_LOG.error(__filename, requestParams.API_PATH, resDataQuizGroup.msg);
                            PACKET.sendFail(req, res, resDataQuizGroup.res);
                        } else {
                            getQuizInfoList(requestParams, resDataQuizGroup.units, resDataQuizGroup.groupList, function (resDataQuizInfoList) {
                                if (COMMON_UTIL.isNull(resDataQuizInfoList) || resDataQuizInfoList.err || !resDataQuizInfoList.isSuccess) {
                                    if (resDataQuizInfoList.err) {
                                        PRINT_LOG.setErrorLog(resDataQuizInfoList.msg, resDataQuizInfoList.err);
                                    }
                                    PRINT_LOG.error(__filename, requestParams.API_PATH, resDataQuizInfoList.msg);
                                    PACKET.sendFail(req, res, resDataQuizInfoList.res);
                                } else {
                                    var resUnits = prepareQuizList(resDataQuizInfoList.units, resDataQuizInfoList.quizGroupList, resDataQuizInfoList.quizInfoList);

                                    getMedalList(requestParams, resUnits, resDataQuizInfoList.quizGroupList, function(resDataMedalList){
                                        if (COMMON_UTIL.isNull(resDataMedalList) || resDataMedalList.err || !resDataMedalList.isSuccess) {
                                            if (resDataMedalList.err) {
                                                PRINT_LOG.setErrorLog(resDataMedalList.msg, resDataMedalList.err);
                                            }
                                            PRINT_LOG.error(__filename, requestParams.API_PATH, resDataMedalList.msg);
                                            PACKET.sendFail(req, res, resDataMedalList.res);
                                        } else {
                                            var responseUnits = prepareMedal(resDataMedalList.units, resDataMedalList.medalList);
                                            var responseObj = prepareResponseObj(responseUnits);
                                            responseObj.update_ts = COMMON_UTIL.getUnixTimestamp();
                                            PACKET.sendSuccess(req, res, responseObj);
                                        }
                                    });

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

