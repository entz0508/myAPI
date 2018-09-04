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
	
    app.post("/skw/report/english/episodeClearList", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT_WITHOUT_PROFILE, function(req, res){
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
			
			requestParams.timeZone = COMMON_UTIL.trim(req.body.time_zone);
			if(requestParams.timeZone == "") {
				requestParams.timeZone = "Asia/Seoul";
			}
			
			MYSQL_SLP_KW_ACTION_LOG_CONN.procGetReportEnEpisodeClearList(requestParams, function(err, results) {
				
				if(err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_SLP_EN_CONN.procGetReportEnEpisodeClearList", err);
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                } else if(COMMON_UTIL.isNull(results) || (0 >= results.length) ) {
                    PRINT_LOG.error(__filename, API_PATH, " db results is null");
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                } else {
                    // 디비 메세지 확인 
                    //PRINT_LOG.error(__filename, API_PATH, "result.res :" + results[0][0]["RES"] );
                    
                    
                    var resultOBJ = {};
                    
                    resultOBJ.res = results[0][0]["RES"];
					if ( results[0][0]["RES"] == 0 ) {
						var resData = COMMON_UTIL.getResDataObj();
						resData.episodeClearList = [];
						
						var len = results[0].length;
						for (var i = 0; i <len; i++) {
							var row = results[0][i];
							var obj = {};
							obj.episodeID = row.EPISODE_ID;
							obj.endDateTime = row.END_DATETIME;
							resData.episodeClearList.push(obj);
						}
						resData.isSuccess = true;

						PACKET.sendSuccess(req, res, resData);
					} else {
						resultOBJ.err = "error";
						resultOBJ.msg = results[0][0]["MSG"];
						PACKET.sendSuccess(req,res, resultOBJ);
					}
                }
				
				
				
				
				
				/*
				var resData = COMMON_UTIL.getResDataObj();
				resData.episodeClearList = [];
				if (err) {
					resData.res = ERROR_CODE_UTIL.RES_FAILED_DB;
					resData.err = err;
					resData.msg = "Failed, MYSQL_SLP_KW_CONN.procGetReportEnEpisodeClearList";
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
								obj.episodeID = row.EPISODE_ID;
								obj.endDateTime = row.END_DATETIME;
								resData.episodeClearList.push(obj);
							}
							resData.isSuccess = true;
							
							 PACKET.sendSuccess(req, res, resData);
							
						}
					}
				}*/
			});


        } catch(catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
}

exports.add_routes = add_routes;
