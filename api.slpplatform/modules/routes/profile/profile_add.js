// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_ACCOUNT_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_ACCOUNT;

exports.add_routes = function(app) {
	app.post("/slp.user.account.profile.add", ROUTE_MIDDLEWARE.AUTH_APP_LOGIN_ACCOUNT_WITHOUT_PROFILE, function(req, res) {
		var API_PATH = req.route.path;
		try {
			var appID = COMMON_UTIL.trim(req.body.app_id);
			var clientUID = COMMON_UTIL.trim(req.body.client_uid);
			var accountID = COMMON_UTIL.trim(req.body.account_id);
			var accessToken = COMMON_UTIL.trim(req.body.access_token);
			var profileName = COMMON_UTIL.trim(req.body.pf_name);
			var profileBirthday = COMMON_UTIL.trim(req.body.pf_birthday);
			var profileGender = COMMON_UTIL.trim(req.body.pf_gender);

			if (!COMMON_UTIL.isNumber(appID) || !COMMON_UTIL.isValidClientUID(clientUID) ||
				!COMMON_UTIL.isNumber(accountID) || !COMMON_UTIL.isValidProfileName(profileName) ||
				!COMMON_UTIL.isValidChildBirthday(profileBirthday) || !COMMON_UTIL.isValidGender(profileGender) ||
				!COMMON_UTIL.isValidAccessToken(accessToken)) {
				PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));
				return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
			}

			MYSQL_SLP_ACCOUNT_CONN.procProfileAdd(appID, clientUID, accountID, accessToken, profileName, profileBirthday, profileGender, function(err, results) {
				if (err) {
					PRINT_LOG.error(__filename, API_PATH, " procProfileAdd, faile db, error");
					return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
				}

				var retV = COMMON_UTIL.getMysqlRES(results);
				if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
					PRINT_LOG.error(__filename, API_PATH, retV.msg);
					return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_INSERT_ACCOUNT_ALLOW_ACCESS_APP);
				}

				var row = results[0][0];
				PACKET.sendSuccess(req, res, {
					pf_id: row.PROFILE_ID,
					name: row.NAME,
					birthday: row.BIRTHDAY,
					gender: row.GENDER,
					hidden: "y" === row.HIDDEN ? 1 : 0,
					img_url: row.IMG_URL
				});
			});
		} catch (catchErr) {
			PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
			PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
		}
	});
};