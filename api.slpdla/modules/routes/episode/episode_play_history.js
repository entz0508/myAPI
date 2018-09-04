// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_KW_ACTION_LOG_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_KW_ACTION_LOG;

exports.add_routes = function (app) {
    app.post("/sdla/episode/episodePlayHistory", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT_WITH_PROFILE, function (req, res) {
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
            requestParams.os = COMMON_UTIL.trim(req.body.os);
            requestParams.clientUID = COMMON_UTIL.trim(req.body.client_uid);
            requestParams.clientVer = COMMON_UTIL.trim(req.body.c_ver);
            requestParams.accountID = COMMON_UTIL.trim(req.body.account_id);
            requestParams.profileID = COMMON_UTIL.trim(req.body.profile_id);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);
            requestParams.lang = "KO";

            if (!COMMON_UTIL.isValidAccountID(requestParams.accountID)) {
                requestParams.accountID = 0;
                requestParams.accessToken = "";
            }

            if (!COMMON_UTIL.isValidAccessToken(requestParams.accessToken)) {
                requestParams.accountID = 0;
                requestParams.accessToken = "";
            }

            MYSQL_SLP_KW_ACTION_LOG_CONN.procGetEpisodePlayHistoryDLA(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_SLP_DLA_CONN.procGetEpisodePlayHistoryDLA", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }
                if (COMMON_UTIL.isNull(results) || (0 >= results.length)) {
                    PRINT_LOG.error(__filename, API_PATH, " db results is null");
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }
                var play_history = [];
                if ((0 < results[0].length)) {
                    var len = results[0].length;

                    var lastCategory = {};
                    lastCategory.EPISODE_LIST = [];
                    var lastEpisode = {};
                    var isFirst = true;
                    var lastEpPlaySRL = 0;
                    for (var i = 0; i < len; i++) {
                        var row = results[0][i];
                        var curChapter = {
                            CHAPTER_ID: row.CHAPTER,
                            PLAY_TIME: row.PLAY_TIME,
                            BEGIN_DATETIME: row.BEGIN_DATETIME,
                            END_DATETIME: row.END_DATETIME
                        };

                        if (lastCategory.CATEGORY_ID === row.CATEGORY_ID) {
                            // EP_PLAY_SRL �� �ٸ��ٸ� ���ο������ ����
                            if (lastEpPlaySRL !== row.EP_PLAY_SRL) {
                                if (!isFirst) {
                                    play_history.push(lastCategory);
                                }

                                // �ʱ�ȭ
                                lastCategory = {};
                                lastCategory.CATEGORY_ID = row.CATEGORY_ID;
                                lastCategory.EP_PLAY_SRL = row.EP_PLAY_SRL;
                                // é�� �÷��� Ÿ�� ����
                                lastCategory.TOTAL_PLAYTIME = Number(curChapter.PLAY_TIME);
                                lastCategory.EPISODE_LIST = [];



                                lastEpisode = {};
                                // ���ο� ���Ǽҵ� ����
                                lastEpisode.EPISODE_ID = row.EPISODE_ID;

                                lastEpisode.CHAPTER = [];
                                lastEpisode.CHAPTER.push(curChapter);

                                lastCategory.EPISODE_LIST.push(lastEpisode);
                                lastEpPlaySRL = row.EP_PLAY_SRL;

                            } else {
                                // ī�װ��� ���ٸ� ���Ǽҵ� Ȯ��
                                if (lastEpisode.EPISODE_ID === row.EPISODE_ID) {
                                    // ���Ǽҵ尡 ���ٸ� ���� �迭�� é�͸� �߰�
                                    lastEpisode.CHAPTER.push(curChapter);
                                    // é�� �÷��� Ÿ�� ����
                                    lastCategory.TOTAL_PLAYTIME += Number(curChapter.PLAY_TIME);
                                } else {
                                    // ���Ǽҵ尡 ���� �ʴٸ� ���ο� �迭�߰� ������ ���Ǽҵ带 ī�װ��� Ǫ��
                                    lastCategory.EPISODE_LIST.push(lastEpisode);

                                    // é�� �÷��� Ÿ�� ����
                                    lastCategory.TOTAL_PLAYTIME = Number(curChapter.PLAY_TIME);
                                    // ���ο� ���Ǽҵ� ����
                                    lastEpisode.EPISODE_ID = row.EPISODE_ID;
                                    lastEpisode.CHAPTER = [];
                                    lastEpisode.CHAPTER.push(curChapter);
                                }
                            }
                            isFirst = false;
                        } else {
                            // ī�װ��� ���� �ʴٸ� lastCategory �� play_history �� push
                            if (!isFirst) {
                                play_history.push(lastCategory);
                            }

                            // �ʱ�ȭ
                            lastCategory = {};
                            lastCategory.CATEGORY_ID = row.CATEGORY_ID;
                            lastCategory.EP_PLAY_SRL = row.EP_PLAY_SRL;
                            // é�� �÷��� Ÿ�� ����
                            lastCategory.TOTAL_PLAYTIME = Number(curChapter.PLAY_TIME);

                            lastCategory.EPISODE_LIST = [];
                            lastEpisode = {};
                            // ���ο� ���Ǽҵ� ����
                            lastEpisode.EPISODE_ID = row.EPISODE_ID;
                            lastEpisode.CHAPTER = [];
                            lastEpisode.CHAPTER.push(curChapter);

                            lastCategory.EPISODE_LIST.push(lastEpisode);
                            lastEpPlaySRL = row.EP_PLAY_SRL;
                            isFirst = false;
                        }
                    }
                    play_history.push(lastCategory);
                }
                PACKET.sendSuccess(req, res, { play_history: play_history });
            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
};