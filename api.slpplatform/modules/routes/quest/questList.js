// nodejs npm
const crypto = require('crypto');

// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_PLATFORM_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_PLATFORM;
const MYSQL_SLP_ACCOUNT_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_ACCOUNT;

exports.add_routes = function(app) {
	app.post("/slp.quest.questList", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) {
		try {
			MYSQL_SLP_PLATFORM_CONN.procWatchdogPing(function(errPlatform, isPlatformSuccess) {
				if (errPlatform || !isPlatformSuccess) return PACKET.sendJson(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, { msg: "Error, DB, Platform" });

				MYSQL_SLP_ACCOUNT_CONN.procWatchdogPing(function(errAccount, isAccountSuccess) {
					if (errAccount || !isAccountSuccess) return PACKET.sendJson(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, { msg: "Error, DB, Account" });
					PACKET.sendSuccess(req, res, { msg: require("/data/www/SERVICE_XML/slpen/dea_quest.json") });
				});
			});
		} catch (catchErr) {
			PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
			PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
		}
	});
};