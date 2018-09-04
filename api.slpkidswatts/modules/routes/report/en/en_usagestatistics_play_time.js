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
    app.post("/skw/report/english/usagestatistics/range", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT_WITH_PROFILE, function(req, res){
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
            
			requestParams.startDate = COMMON_UTIL.trim(req.body.start_date);
			requestParams.endDate = COMMON_UTIL.trim(req.body.end_date);
			
			requestParams.timeZone = COMMON_UTIL.trim(req.body.time_zone);
			if(requestParams.timeZone == "") {
				requestParams.timeZone = "Asia/Seoul";
			}
			
            if(!COMMON_UTIL.isValidAccountID(requestParams.accountID) ||
                !COMMON_UTIL.isValidAccessToken(requestParams.accessToken) ||
                !COMMON_UTIL.isValidProfileID(requestParams.profileID) ) {
                PRINT_LOG.error(__filename, API_PATH, " error, params, AccountID:" + requestParams.accountID +
                                                        ", accessToken:" + requestParams.accessToken +
                                                        ", prfileID:" + requestParams.profileID);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
                return;
            }
			
			var responseOBJ = {};
			
			MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnUsagestatisticsPlayTime(requestParams, function(err, results){
				if(err) {
					PRINT_LOG.setErrorLog("Failed, MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnUsagestatisticsPlayTime", err); 
					PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
				} else if(COMMON_UTIL.isNull(results) || (0 >= results.length) ) {
					PRINT_LOG.error(__filename, API_PATH, " db results is null");
					PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
				} else {
					
					responseOBJ.account_id = Number(requestParams.accountID);
					responseOBJ.profile_id = Number(requestParams.profileID);
					responseOBJ.total_episodeRunningTime = 0;
					responseOBJ.total_episodeRunningTimeAvg = 30;
					responseOBJ.total_episodePlayCount = 4;
					
					responseOBJ.myTotal_episodeRunningTime = 0;
					responseOBJ.myTotal_episodeRunningTimeAvg = 0;
					responseOBJ.myTotal_episodePlayCount = 0;
					
					responseOBJ.myPlayRecord = [];
					
					if ( results[0].length == 0 ) {
						
					} else {
						responseOBJ.total_episodeRunningTime = results[0][0].totalPlayTime_min;
						//responseOBJ.total_episodeRunningTimeAvg = results[0][0].totalPlayTime_min_avg;
						//responseOBJ.total_episodePlayCount = results[0][0].totalPlayCount;
						responseOBJ.myTotal_episodeRunningTime = results[0][0].myTotalPlayTime_min;
						responseOBJ.myTotal_episodeRunningTimeAvg = results[0][0].myTotalPlayTime_min_avg;
						responseOBJ.myTotal_episodePlayCount = results[0][0].myTotalPlayCount;

						if( (0 < results[0].length) ) {

							var len = results[0].length;
							for(var i=0; i<len; i++) {
								var row = results[0][i];
								var obj = {};

								obj.date				= row.DATE;
								obj.running_time_sum	= row.SUM_PLAYTIME;
								obj.running_time_avg	= row.AVG_PLAYTIME;
								obj.play_count			= row.PLAY_COUNT;
								responseOBJ.myPlayRecord.push(obj);
							}
						}
					}

					PACKET.sendSuccess(req, res, responseOBJ);
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

