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

    var getStepObj = function() {
        var stepObj = {};
        stepObj.step_id = "";   // step id
        stepObj.begin_ts = 0;   // step 시작시간 unix_timestamp
        stepObj.avr_learn_per = 0;  // 평균학습 진행률
        stepObj.q_r_per = 0;    // 퀴즈 정답률
        stepObj.h_p_per = 0;    // 홈스쿨 진행률
        stepObj.n_p_e_cnt = 0;  // 플레이하지 않은 에피소드 갯수
        stepObj.t_e_cnt = 0;    // 전체 에피소드 갯수
        stepObj.n_p_q_cnt = 0;  // 풀지 않은 퀴즈 갯수
        stepObj.t_q_cnt = 0;    // 전체 퀴즈 갯수
        stepObj.n_p_h_cnt = 0;  // 진행하지 않은 복습활동 갯수
        stepObj.t_h_cnt = 0;    // 전체 복습활동 갯수
        stepObj.e_p_c_cnt = 0;  // 학습 완료
        stepObj.e_p_i_cnt = 0;  // 학습 진행중
        stepObj.e_p_n_cnt = 0;  // 학습 안함

        stepObj.quiz = {};
        stepObj.quiz.avr_r_per = 0; // 평균 정답률
        stepObj.quiz.q_r_p_per = 0; // Phonics 영역 문제 정답률
        stepObj.quiz.q_r_v_per = 0; // Vocabulary 영역 문제 정답률
        stepObj.quiz.q_r_s_per = 0; // Sentence 영역 문제 정답률
        stepObj.quiz.quiz_list = [];

        stepObj.home = {};
        stepObj.home.prog_per = 0;  // 홈스쿨 진행률
        stepObj.home.h_t_cnt = 0;   // 홈스쿨 전체 갯수
        stepObj.home.h_c_cnt = 0;   // 홈스쿨 완료 갯수
        stepObj.home.h_n_cnt = 0;   // 홈스쿨 미완료 갯수
        stepObj.home.home_list = [];


        stepObj.ep_list = [];
        return stepObj;
    };


    var getStepList = function(requestParams, callBack) {
        MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishLearningReportStepList(requestParams, function(err, results) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.stepList = [];
            if (err) {
                resData.res = ERROR_CODE_UTIL.RES_FAILED_DB;
                resData.err = err;
                resData.msg = "Failed, MYSQL_SLP_KW_CONN.procGetReportEnglishLearningReportStepList";
                PRINT_LOG.setErrorLog(resData.msg , err);
            } else if (COMMON_UTIL.isNull(results) || (0 >= results.length)) {
                PRINT_LOG.error(__filename, API_PATH, "MYSQL_SLP_KW_CONN.procGetReportEnglishLearningReportStepList, db results is null");
            } else {
                if (0 >= results[0].length) {
                    resData.isSuccess = true;
                } else {
                    var retV = COMMON_UTIL.getMysqlRES(results);
                    if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                        resData.res = retV.res;
                        resData.msg = "res:" + retV.res + ", " + retV.msg;
                        PRINT_LOG.error(__filename, API_PATH, resData.msg);
                    } else {
                        var len = results[0].length;
                        for (var i = 0; i <len; i++) {
                            var row = results[0][i];

                            var obj = {};
                            obj.stepID = row.STEP_ID;
                            obj.btginTS = row.BEGIN_TS;
                            obj.pTime = row.PLAY_TIME;
                            obj.endCount = {};
                            obj.endCount.yes =row.END_Y_CNT;
                            obj.endCount.no =row.END_N_CNT;

                            obj.quizResultCount = {};
                            obj.quizResultCount.yes = row.QUIZ_RESULT_Y_CNT;
                            obj.quizResultCount.no = row.QUIZ_RESULT_N_CNT;

                            obj.homeSchoolCount = {};
                            obj.homeSchoolCount.yes = row.HOMESCHOOL_Y_CNT;
                            obj.homeSchoolCount.no = row.HOMESCHOOL_Y_CNT;

                            resData.stepList.push(obj);
                        }
                        resData.isSuccess = true;
                    }
                }

            }
            callBack(resData);
        });
    };

    var prepareStep = function(stepList) {
        var steps = [];
        var len = stepList.length;
        if( 0 < len ) {

            for(var i=0; i<len; i++) {
                var row = stepList[i];

                var stepObj = getStepObj();
                stepObj.step_id = row.stepID;   // step id
                stepObj.begin_ts = row.btginTS;   // step 시작시간 unix_timestamp
                stepObj.p_time = row.pTime;
                stepObj.avr_learn_per = 0;  // 평균학습 진행률
                stepObj.q_r_per = 0;    // 퀴즈 정답률
                stepObj.h_p_per = 0;    // 홈스쿨 진행률
                stepObj.n_p_e_cnt = 0;  // 플레이하지 않은 에피소드 갯수
                stepObj.t_e_cnt = global.XML_EPISODE_LIST.length;    // 전체 에피소드 갯수
                stepObj.n_p_q_cnt = global.XML_QUIZ_LIST.length - (row.quizResultCount.yes + row.quizResultCount.no);  // 풀지 않은 퀴즈 갯수
                stepObj.t_q_cnt = global.XML_QUIZ_LIST.length;    // 전체 퀴즈 갯수
                stepObj.n_p_h_cnt = 0;  // 진행하지 않은 복습활동 갯수
                stepObj.t_h_cnt = 0;    // 전체 복습활동 갯수
                stepObj.e_p_c_cnt = row.endCount.yes;  // 학습 완료
                stepObj.e_p_i_cnt = row.endCount.no;  // 학습 진행중
                stepObj.e_p_n_cnt = global.XML_EPISODE_LIST.length - (row.endCount.yes + row.endCount.no);  // 학습 안함

                stepObj.quiz = {};
                stepObj.quiz.avr_r_per = 0; // 평균 정답률
                stepObj.quiz.q_r_p_per = 0; // Phonics 영역 문제 정답률
                stepObj.quiz.q_r_v_per = 0; // Vocabulary 영역 문제 정답률
                stepObj.quiz.q_r_s_per = 0; // Sentence 영역 문제 정답률
                stepObj.quiz.quiz_list = [];

                stepObj.home = {};
                stepObj.home.prog_per = 0;  // 홈스쿨 진행률
                stepObj.home.h_t_cnt = 0;   // 홈스쿨 전체 갯수
                stepObj.home.h_c_cnt = 0;   // 홈스쿨 완료 갯수
                stepObj.home.h_n_cnt = 0;   // 홈스쿨 미완료 갯수
                stepObj.home.home_list = [];

                steps.push(stepObj);
            }
        }
        return steps;
    };

    var getStepQuizList = function(requestParams, steps, callBack){
        MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishLearningReportQuizList(requestParams, function(err, results) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.quizList = [];
            if (err) {
                resData.res = ERROR_CODE_UTIL.RES_FAILED_DB;
                resData.err = err;
                resData.msg = "Failed, MYSQL_SLP_KW_CONN.procGetReportEnglishLearningReportQuizList";
                PRINT_LOG.setErrorLog(resData.msg , err);
            } else {
                if (0 >= results[0].length) {
                    resData.isSuccess = true;
                } else {
                    var retV = COMMON_UTIL.getMysqlRES(results);
                    if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                        resData.res = retV.res;
                        resData.msg = "res:" + retV.res + ", " + retV.msg;
                        PRINT_LOG.error(__filename, API_PATH, resData.msg);
                    } else {
                        var len = results[0].length;
                        for (var i = 0; i <len; i++) {
                            var row = results[0][i];
                            var obj = {};
                            obj.stepID = row.STEP_ID;
                            obj.quizID = Number(row.QUIZ_ID);
                            obj.result = Number(row.RESULT);
                            resData.quizList.push(obj);
                        }
                        resData.isSuccess = true;
                    }
                }
            }
            callBack(resData);
        });


    };

    var prepareQuizList = function(steps, quizList) {
        var stepLen = steps.length;
        for(var stepIdx=0; stepIdx<stepLen; stepIdx++) {
            var quizLen = quizList.length;

            var quizPhonic = {};
            quizPhonic.totalQuizCount = 0;
            quizPhonic.resultYesCount = 0;
            quizPhonic.resultNoCount = 0;

            var quizVocabulary = {};
            quizVocabulary.totalQuizCount = 0;
            quizVocabulary.resultYesCount = 0;
            quizVocabulary.resultNoCount = 0;

            var quizSentence = {};
            quizSentence.totalQuizCount = 0;
            quizSentence.resultYesCount = 0;
            quizSentence.resultNoCount = 0;

            steps[stepIdx].quiz.quiz_list = COMMON_UTIL.getStepAllQuizList(steps[stepIdx].step_id);

            for(var qIdx=0; qIdx<quizLen; qIdx++) {
                var quiz = quizList[qIdx];
                if( steps[stepIdx].step_id === quiz.stepID) {
                    if( COMMON_UTIL.isQuizTypePhonics(quiz.quizID) ){
                        quizPhonic.totalQuizCount++;
                        if(1 == quiz.result ) {
                            quizPhonic.resultYesCount++;
                        } else {
                            quizPhonic.resultNoCount++;
                        }
                    } else if( COMMON_UTIL.isQuizTypeVocabulary(quiz.quizID) ){
                        quizVocabulary.totalQuizCount++;
                        if(1 == quiz.result ) {
                            quizVocabulary.resultYesCount++;
                        } else {
                            quizVocabulary.resultNoCount++;
                        }
                    } else if( COMMON_UTIL.isQuizTypeSentence(quiz.quizID) ){
                        quizSentence.totalQuizCount++;
                        if(1 == quiz.result ) {
                            quizSentence.resultYesCount++;
                        } else {
                            quizSentence.resultNoCount++;
                        }
                    }

                    var listLen = steps[stepIdx].quiz.quiz_list.length;
                    for(var i=0; i<listLen; i++) {
                        if( quiz.quizID === steps[stepIdx].quiz.quiz_list[i].id) {
                            steps[stepIdx].quiz.quiz_list[i].result = quiz.result;
                            break;
                        }
                    }

                }
            }

            steps[stepIdx].quiz.q_r_p_per = COMMON_UTIL.calcPercent(quizPhonic.resultYesCount, (quizPhonic.resultYesCount + quizPhonic.resultNoCount)); // Phonics 영역 문제 정답률
            steps[stepIdx].quiz.q_r_v_per = COMMON_UTIL.calcPercent(quizVocabulary.resultYesCount, (quizVocabulary.resultYesCount + quizVocabulary.resultNoCount)); // Vocabulary 영역 문제 정답률
            steps[stepIdx].quiz.q_r_s_per = COMMON_UTIL.calcPercent(quizSentence.resultYesCount, (quizSentence.resultYesCount + quizSentence.resultNoCount)); // Sentence 영역 문제 정답률

            steps[stepIdx].quiz.avr_r_per = COMMON_UTIL.calcDiv(steps[stepIdx].quiz.q_r_p_per + steps[stepIdx].quiz.q_r_v_per + steps[stepIdx].quiz.q_r_s_per, 3); // 평균 정답률
        }
        return steps;
    };

    var getStepHomeschoolList = function(requestParams, steps, callBack) {
        MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishLearningReportStepHomeschoolList(requestParams, function(err, results) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.stepList = steps;
            resData.homeschollList = [];
            if (err) {
                resData.res = ERROR_CODE_UTIL.RES_FAILED_DB;
                resData.err = err;
                resData.msg = "Failed, MYSQL_SLP_KW_CONN.procGetReportEnglishLearningReportStepHomeschoolList";
                PRINT_LOG.setErrorLog(resData.msg , err);
            } else {
                var retV = COMMON_UTIL.getMysqlRES(results);
                if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                    resData.res = retV.res;
                    resData.msg = "res:" + retV.res + ", " + retV.msg;
                    PRINT_LOG.error(__filename, API_PATH, resData.msg);
                } else {
                    var len = results[0].length;
                    for (var i = 0; i < len; i++) {
                        var row = results[0][i];

                        var obj = {};
                        obj.stepID = row.STEP_ID;
                        obj.episodeID = row.EPISODE_ID;
                        obj.status = Number(row.STATUS);

                        resData.homeschollList.push(obj);
                    }
                    resData.isSuccess = true;
                }

            }
            callBack(resData);
        });
    };

    var prepareHomeschoolList = function(steps, homeschoolList) {
        var stepLen = steps.length;
        for(var stepIdx=0; stepIdx<stepLen; stepIdx++) {
            var homeLen = homeschoolList.length;

            var totalCount = 0;
            var completeCount = 0;
            var notCompleteCount = 0;

            for(var homeIdx=0; homeIdx<homeLen; homeIdx++) {
                var homeSchool = homeschoolList[homeIdx];
                if( homeSchool.stepID === steps[stepIdx].step_id ) {
                    totalCount++;

                    var homeObj = {};
                    homeObj.id = homeSchool.episodeID;
                    homeObj.status = homeSchool.status;
                    if( 0 == homeObj.status ) {
                        notCompleteCount++;
                    } else  if( 1 == homeObj.status ) {
                        completeCount++;
                    }
                    steps[stepIdx].home.home_list.push(homeObj)
                }
            }

            steps[stepIdx].home.prog_per = COMMON_UTIL.calcDiv(completeCount, totalCount);   // 홈스쿨 진행률
            steps[stepIdx].home.h_t_cnt = totalCount;       // 홈스쿨 전체 갯수
            steps[stepIdx].home.h_c_cnt = completeCount ;   // 홈스쿨 완료 갯수
            steps[stepIdx].home.h_n_cnt = notCompleteCount; // 홈스쿨 미완료 갯수
        }
        return steps;
    };


    var getStepEpisodeList = function(requestParams, steps, callBack) {
        MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnglishLearningReportStepEpisodeList(requestParams, function(err, results) {
            var resData = COMMON_UTIL.getResDataObj();
            resData.stepList = steps;
            resData.episodeList = [];
            if (err) {
                resData.res = ERROR_CODE_UTIL.RES_FAILED_DB;
                resData.err = err;
                resData.msg = "Failed, MYSQL_SLP_KW_CONN.procGetReportEnglishLearningReportStepEpisodeList";
                PRINT_LOG.setErrorLog(resData.msg , err);
            } else {
                var retV = COMMON_UTIL.getMysqlRES(results);
                if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                    resData.res = retV.res;
                    resData.msg = "res:" + retV.res + ", " + retV.msg;
                    PRINT_LOG.error(__filename, API_PATH, resData.msg);
                } else {
                    var len = results[0].length;
                    for (var i = 0; i < len; i++) {
                        var row = results[0][i];

                        var obj = {};
                        obj.stepID  = row.STEP_ID;
                        obj.episodeID = row.EPISODE_ID;
                        obj.playCount = Number(row.PLAY_CNT);
                        obj.playPer = Number(row.PLAY_PER);

                        resData.episodeList.push(obj);
                    }
                    resData.isSuccess = true;
                }
            }
            callBack(resData);
        });
    };

    var prepareStepEpisodeList = function(steps, episodeList) {
        var stepLen = steps.length;
        for(var stepIdx=0; stepIdx<stepLen; stepIdx++) {
            var epLen = episodeList.length;

            for(var epIdx=0; epIdx<epLen; epIdx++) {
                var ep = episodeList[epIdx];
                if( ep.stepID === steps[stepIdx].step_id ) {
                    var epObj = {};
                    epObj.ep_id = ep.episodeID;
                    epObj.p_cnt = ep.playCount;
                    epObj.p_per = ep.playPer;
                    steps[stepIdx].ep_list.push(epObj)
                }
            }
        }
        return steps;
    };

    app.post("/skw/report/english/learningreport", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT_WITH_PROFILE, function(req, res){
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


            getStepList(requestParams, function(resDataStepList){
                if (COMMON_UTIL.isNull(resDataStepList) || resDataStepList.err || !resDataStepList.isSuccess) {
                    if (resDataStepList.err) {
                        PRINT_LOG.setErrorLog(resDataStepList.msg, resDataStepList.err);
                    }
                    PRINT_LOG.error(__filename, requestParams.API_PATH, resDataStepList.msg);
                    PACKET.sendFail(req, res, resDataStepList.res);
                } else {
                    var steps = prepareStep(resDataStepList.stepList);
                    getStepQuizList(requestParams, steps, function(resDataQuizList){
                        if (COMMON_UTIL.isNull(resDataQuizList) || resDataQuizList.err || !resDataQuizList.isSuccess) {
                            if (resDataQuizList.err) {
                                PRINT_LOG.setErrorLog(resDataQuizList.msg, resDataQuizList.err);
                            }
                            PRINT_LOG.error(__filename, requestParams.API_PATH, resDataQuizList.msg);
                            PACKET.sendFail(req, res, resDataQuizList.res);
                        } else {
                            var stepsWithQuiz = prepareQuizList(steps, resDataQuizList.quizList);
                            getStepHomeschoolList(requestParams, stepsWithQuiz, function(resDataHomeschoolList) {
                                if (COMMON_UTIL.isNull(resDataHomeschoolList) || resDataHomeschoolList.err || !resDataHomeschoolList.isSuccess) {
                                    if (resDataHomeschoolList.err) {
                                        PRINT_LOG.setErrorLog(resDataHomeschoolList.msg, resDataHomeschoolList.err);
                                    }
                                    PRINT_LOG.error(__filename, requestParams.API_PATH, resDataHomeschoolList.msg);
                                    PACKET.sendFail(req, res, resDataHomeschoolList.res);
                                } else {
                                    var stepsWithHomeschool = prepareHomeschoolList(resDataHomeschoolList.stepList, resDataHomeschoolList.homeschollList);
                                    getStepEpisodeList(requestParams, stepsWithHomeschool, function(resDataEpisodeList){
                                        if (COMMON_UTIL.isNull(resDataEpisodeList) || resDataEpisodeList.err || !resDataEpisodeList.isSuccess) {
                                            if (resDataHomeschoolList.err) {
                                                PRINT_LOG.setErrorLog(resDataEpisodeList.msg, resDataEpisodeList.err);
                                            }
                                            PRINT_LOG.error(__filename, requestParams.API_PATH, resDataEpisodeList.msg);
                                            PACKET.sendFail(req, res, resDataEpisodeList.res);
                                        } else {
                                            var stepsWithEpisodeList = prepareStepEpisodeList(resDataEpisodeList.stepList, resDataEpisodeList.episodeList);
                                            var responseOBJ = {};
                                            responseOBJ.update_ts = COMMON_UTIL.getUnixTimestamp();
                                            responseOBJ.steps = stepsWithEpisodeList;
                                            PACKET.sendSuccess(req, res, responseOBJ);
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

