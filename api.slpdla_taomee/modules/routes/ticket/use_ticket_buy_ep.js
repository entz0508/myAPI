

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

const MYSQL_SLP_DLA_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA;

function add_routes(app) {
    "use strict";


    app.post("/sdla.use.ticket.buyep", ROUTE_MIDDLEWARE.LOGGED_IN_USER, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var os = COMMON_UTIL.trim(req.body.os);
            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientUID = COMMON_UTIL.trim(req.body.client_uid);
            var clientVer = COMMON_UTIL.trim(req.body.c_ver);

            var lev = Number(global.CONFIG.SERVER_INFO.LEVEL);

            var slpAccountID = COMMON_UTIL.trim(req.body.account_id);
            var slpAccountAccessToken = COMMON_UTIL.trim(req.body.account_access_token);
            var userID = COMMON_UTIL.trim(req.body.user_id);
            var userAccessToken = COMMON_UTIL.trim(req.body.user_access_token);
            var episodeID = COMMON_UTIL.trim(req.body.ep_id);


            var epObj= COMMON_UTIL.getEpisodeInfo(episodeID);
            if( COMMON_UTIL.isNull(epObj) ) {
                PRINT_LOG.error(__filename, API_PATH, "error not found episode, episodeID:" + episodeID);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }


            MYSQL_SLP_DLA_CONN.procUseTicketBuyEpisode(appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, episodeID, function(err, results) {
                    var msg = "";
                    if (err) {
                        msg = "Failed, MYSQL_SLP_DLA_CONN.procUseTicketBuyEpisode";
                        PRINT_LOG.setErrorLog(msg, err);
                    } else if (COMMON_UTIL.isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
                        msg = "MYSQL_SLP_DLA_CONN.procUseTicketBuyEpisode, db results is null";
                        PRINT_LOG.error(__filename, API_PATH, msg);
                    } else {
                        var retV = COMMON_UTIL.getMysqlRES(results);
                        if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                            PRINT_LOG.error(__filename, API_PATH, retV.msg);
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.convertDbErrorCodeToResultCode(retV.res));
                        } else {
                            var responseObj = {};
                            responseObj.ep_id = results[0][0].EPISODE_ID;
                            responseObj.begin_ts = results[0][0].BEGIN_DATETIME_TS;
                            responseObj.end_ts = results[0][0].END_DATETIME_TS;
                            responseObj.tickets = COMMON_UTIL.prepareTicketQTY(results[0][0]);
                            PACKET.sendSuccess(req, res, responseObj);
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