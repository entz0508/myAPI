// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_DLA_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA;

exports.add_routes = function(app) {
	app.post("/sdla/episode/getTopRankEpisodePlay", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT_WITHOUT_PROFILE, function(req, res) {
		var API_PATH = req.route.path;
		var CLIENT_IP = COMMON_UTIL.getClientIP(req);
		try {
			var responseOBJ = {};
			responseOBJ.EPISODE_PLAY_RANK = [];
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
			requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);
			requestParams.searchLimit = COMMON_UTIL.trim(req.body.search_limit);
			requestParams.searchBoundary = COMMON_UTIL.trim(req.body.search_boundary);
			requestParams.lang = "KO";

			if (!COMMON_UTIL.isValidAccountID(requestParams.accountID) || !COMMON_UTIL.isValidAccessToken(requestParams.accessToken)) {
				requestParams.accountID = 0;
				requestParams.accessToken = "";
			}

			if (requestParams.searchBoundary !== "GLOBAL" && requestParams.searchBoundary !== "DOMESTIC") {
				responseOBJ.MSG = "Choose One 'GLOBAL' or 'DOMESTIC' for Boundary ";
				return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
			}

			if (requestParams.searchLimit < 1) {
				responseOBJ.MSG = "There is No Search Limit Number in Parameter!!";
				return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
			}

			responseOBJ.SEARCH_LIMIT = Number(requestParams.searchLimit);
			responseOBJ.SEARCH_BOUNDARY = requestParams.searchBoundary;

			MYSQL_SLP_DLA_CONN.procGetTopRankEpisodePlay(requestParams, function(err, results) {
				if (err) {
					PRINT_LOG.setErrorLog("Failed, MYSQL_SLP_DLA_CONN.procGetTopRankEpisodePlay", err);
					return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
				}
				if (COMMON_UTIL.isNull(results) || (0 >= results.length)) {
					PRINT_LOG.error(__filename, API_PATH, " db results is null");
					return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
				}
				if ((0 < results[0].length)) {
					for (var i = 0, len = results[0].length; i < len; i++) {
						var row = results[0][i];
						responseOBJ.EPISODE_PLAY_RANK.push({ EPISODE_ID: row.EPISODE_ID, PLAY_COUNT: row.CNT });
					}
				}

				PACKET.sendSuccess(req, res, responseOBJ);
			});
		} catch (catchErr) {
			PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
			PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
		}
	});
};