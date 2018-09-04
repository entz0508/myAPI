// common 
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_COMMON_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_COMMON;

function add_routes(app) {
    "use strict";
    app.post("/sen/quest/questRequestList", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT_WITHOUT_PROFILE, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var responseOBJ = {};
            var requestParams = {};
            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.countryCode = COMMON_UTIL.trimCountry(req.body.country);
            requestParams.appID = COMMON_UTIL.trim(req.body.app_id);
            requestParams.os = COMMON_UTIL.trim(req.body.os);
            requestParams.clientUID = COMMON_UTIL.trim(req.body.client_uid);
            requestParams.clientVer = COMMON_UTIL.trim(req.body.c_ver);
            requestParams.accountID = COMMON_UTIL.trim(req.body.account_id);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.account_access_token);
            requestParams.profileID = COMMON_UTIL.trim(req.body.profile_id);
            if (requestParams.profileID == "") {
                requestParams.profileID = COMMON_UTIL.trim(req.body.pf_id);
            }

            requestParams.isTest = COMMON_UTIL.trim(req.body.is_test);

            requestParams.questId = "";
            requestParams.questAppID = "";
            requestParams.questClass = "";
            requestParams.questDuplicateUnit = "";
            requestParams.questStarpoint = "";
            requestParams.questCount = 0;

            requestParams.timeZone = "Asia/Seoul";

            requestParams.timeZone = COMMON_UTIL.trim(req.body.time_zone);
            if (requestParams.timeZone == "") {
                requestParams.timeZone = "Asia/Seoul";
            }

            if (!COMMON_UTIL.isValidAccountID(requestParams.accountID)) {
                requestParams.accountID = 0;
                requestParams.accessToken = "";
            }

            if (!COMMON_UTIL.isValidAccessToken(requestParams.accessToken)) {
                requestParams.accountID = 0;
                requestParams.accessToken = "";
            }

            // ������ ���̵� ������ ������ ���̵� 0 ���� �����մϴ�.
            if (null == requestParams.profileID) { requestParams.profileID = 0; }

            var xml2js = require('xml2js');
            var parser = new xml2js.Parser();
            var request = require("request");
            var url = global.CONFIG.CDN_INFO.URI + "dea/data/dea_quest.xml";
            if (requestParams.isTest == "true") {
                var url = global.CONFIG.CDN_INFO.DEV_CDN + "dea/data/dea_quest.xml";
            }

            request({
                uri: url,
                method: "GET"
            }, function (error, response, body) {
                //PRINT_LOG.info("","",body);
                parser.parseString(body, function (err, result) {
                    requestParams.questCount = 0;

                    var i = 0;
                    while (i < result.root.quests[0].quest.length) {
                        var curQuest = result.root.quests[0].quest[i];

                        if (result.root.quests[0].quest[i]["use"] == "true") {
                            requestParams.questId += curQuest["quest_id"];
                            requestParams.questClass += curQuest["class"];
                            requestParams.questDuplicateUnit += curQuest["duplicate_unit"];
                            requestParams.questStarpoint += curQuest["point"];
                            requestParams.questAppID += requestParams.appID;
                            requestParams.questCount++;
                        }
                        i++;

                        if (i < (result.root.quests[0].quest.length)) {
                            if (curQuest["use"] == "true") {
                                requestParams.questId += ",";
                                requestParams.questClass += ",";
                                requestParams.questDuplicateUnit += ",";
                                requestParams.questStarpoint += ",";
                                requestParams.questAppID += ",";
                            }
                        }
                    }

                    MYSQL_SLP_COMMON_CONN.procQuestRequestList(requestParams, function (err, results) {
                        if (err) {
                            PRINT_LOG.setErrorLog("Failed, MYSQL_SLP_EN_CONN.procQuestRequestList", err);
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                        } else if (COMMON_UTIL.isNull(results) || (0 >= results.length)) {
                            PRINT_LOG.error(__filename, API_PATH, " db results is null");
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                        } else {

                            //PRINT_LOG.setErrorLog("QuestRequestList!!! : " , results[0][0].MSG);
                            responseOBJ.QUEST_LIST = JSON.parse("[" + results[0][0].MSG + "]");
                            responseOBJ.ACCOUNT_ID = results[0][0].ACCOUNT_ID;
                            responseOBJ.PROFILE_ID = results[0][0].PROFILE_ID;
                            responseOBJ.ACCOUNT_POINT = results[0][0].ACCOUNT_POINT;

                            PACKET.sendSuccess(req, res, responseOBJ);
                        }
                    });

                });
            });





        } catch (catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });



}

exports.add_routes = add_routes;

