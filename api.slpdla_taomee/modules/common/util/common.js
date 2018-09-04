var isNull = function isNull(chk_value) {
	"use strict";
	if ((typeof chk_value === "undefined") || (null === chk_value) || (undefined === chk_value) || ("" === chk_value)) {
		return true;
	} else {
		return false;
	}
};

var isRegExp = function isRegExp(type, value) {
	"use strict";

	if (isNull(value)) {
		return false;
	}

	var reg_exp = '';

	if (type === 'lower_case') { // 소문자
		reg_exp = /^[a-z]+$/g;
	} else if (type === 'upper_case') { // 대문자
		reg_exp = /^[A-Z]+$/g;
	} else if (type === 'alphabet') { // 영문자
		reg_exp = /^[A-Za-z]+$/g;
	} else if (type === 'number') { // 숫자
		reg_exp = /^[0-9]+$/g;
	} else if (type === 'email') { // 이메일
		reg_exp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
		// reg_exp=/^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
		//reg_exp = /^[\w!#$%&\'*+\/=?^`{|}~.-]+@(?:[ a-z\d][ a-z\d-]*(?:\.[ a-z\d][ a-z\d-]*)?)+\.(?:[a-z][a-z\d-]+)$/i;
	} else if (type === 'handphone') { // 핸드폰번호 - 국내전용(해외는 확인 필요)
		reg_exp = /^01\d{1}-\d{3,4}-\d{4}$/;
	} else if (type === 'telephone') { // 일반번호
		reg_exp = /^\d{3}-\d{3,4}-\d{4}$/;
	} else if (type == 'password') { // 비밀번호 (특수기호 제외하고 7~21)
		reg_exp = /^[a-zA-Z0-9_]+$/g;
	} else if (type === 'first_name') { // 이름 (50자 이하)
		reg_exp = /^([가-힣a-zA-Z_]{1,50})$/;
	} else if (type === 'last_name') { // 성 (10자 이하)
		reg_exp = /^([가-힣a-zA-Z_]{1,10})$/;
	} else if (type === 'nick_name') { // 성 (10자 이하)
		reg_exp = /^([가-힣a-zA-Z0-9_]{1,10})$/;
	} else if (type === 'birth') { // 생일형식
		reg_exp = /^[0-9]{8}$/;
	} else if (type === 'alphabet_number') { // 영문과 숫자만
		reg_exp = /^[A-Za-z0-9_]+$/g;
	} else if (type === 'app') {                // service 체크 dla,sns,web,adm
		reg_exp = /(\W|^)(dla|kidswell|watchdog)(\W|$)/;
	} else if (type === 'language') { // 국가 코드 확인
		reg_exp = /(\W|^)(kr|en|jp|ch|tw)(\W|$)/;
	} else if (type === 'os') { // os 확인
		reg_exp = /(\W|^)(ios|android)(\W|$)/;
	} else if (type === 'age_gb') { // 앱 연령 확인
		reg_exp = /(\W|^)(3|4|5|6)(\W|$)/;
	} else {
		return false;
	}

	return reg_exp.test(value);
};


/**
 * @desc    byte 체크
 * @param    chk_value
 * @return    int                    결과값
 */
var calByte = function(chk_value) {
	"use strict";
	var tmp_str = chk_value;
	var tmp_len = 0;
	var one_chr;
	var tot_cnt = 0;

	tmp_len = tmp_str.length;

	for (var i = 0; i < tmp_len; i++) {
		one_chr = tmp_str.charAt(i);
		if (escape(one_chr).length > 4) {
			tot_cnt += 2;
		} else if (one_chr != '\r') {
			tot_cnt++;
		}
	}
	return tot_cnt;
};

var makePassword = function(pwdLength, isSpecialChar) {
	"use strict";
	var iteration = 0;
	var password = "";
	var randomNumber;
	if (isNull(isSpecialChar)) {
		isSpecialChar = false;
	}

	while (iteration < pwdLength) {
		randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
		if (!isSpecialChar) {
			if ((randomNumber >= 33) && (randomNumber <= 47)) {
				continue;
			}
			if ((randomNumber >= 58) && (randomNumber <= 64)) {
				continue;
			}
			if ((randomNumber >= 91) && (randomNumber <= 96)) {
				continue;
			}
			if ((randomNumber >= 123) && (randomNumber <= 126)) {
				continue;
			}
		}
		iteration++;
		password += String.fromCharCode(randomNumber);
	}

	password = password.toLowerCase();
	return password;
};

var getWeek = function(date) {
	"use strict";
	var onejan = new Date(date.getFullYear(), 0, 1);
	return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};


var getUnixTimestamp = function() {
	"use strict";
	return Math.floor(new Date().getTime() / 1000);
};

// checked
var getClientIP = function(req) {
	if (!isNull(req.headers['x-forwarded-for'])) return req.headers['x-forwarded-for'];
	if (!isNull(req._remoteAddress)) return req._remoteAddress;
	return "0.0.0.0";
};

var isLoggedIn = function(MYSQL_DLA_CONN, appID, os, clientUID, slpAccountID, slpAccountAccessToken, callBack) {
	"use strict";
	var PRINT_LOG = global.PRINT_LOGGER;
	MYSQL_DLA_CONN.procIsLoggedIn(appID, os, clientUID, slpAccountID, slpAccountAccessToken, function(err, results) {
		var isSuccess = false;
		if (err) {
			var msg = "MYSQL_SLP_ACCOUNT_CONN.procIsLoginUserAccount, failed db, code:" + -1;
			PRINT_LOG.setErrorLog(msg, err);
		} else if (isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
			var msg = "MYSQL_SLP_ACCOUNT_CONN.procAuthAppID, results is null, \t\t [ " + __filename + "]";
			PRINT_LOG.error(__filename, "", msg);
		} else {
			var row = results[0][0];
			if (0 === Number(row.RES)) {
				if (Number(userID) === Number(row.USER_ID)) {
					isSuccess = true;
				}
			} else {
				PRINT_LOG.error(__filename, "", "MYSQL_SLP_ACCOUNT_CONN.procIsLoginUserAccount, DB error : " + row.RES, ", msg:" + row.MSG);
			}
		}
		callBack(isSuccess);
	});
};

var isValidAllowAPP = function(MYSQL_SLP_ACCOUNT_CONN, appID, clientIdentifier, clientIP, accountID, accessToken, callBack) {
	"use strict";
	var PRINT_LOG = global.PRINT_LOGGER;

	MYSQL_SLP_ACCOUNT_CONN.procIsAllowAPP(appID, clientIdentifier, clientIP, accountID, accessToken, function(err, results) {
		var isSuccess = false;
		var code = "";
		var msg = "";
		if (err) {
			code = -1;
			msg = "MYSQL_SLP_ACCOUNT_CONN.procIsAllowAPP, failed db, code:" + code;
			PRINT_LOG.setErrorLog(msg, err);
		} else if (isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
			msg = "MYSQL_SLP_ACCOUNT_CONN.procIsAllowAPP, results is null, \t\t [ " + __filename + "]";
			PRINT_LOG.error(__filename, "", msg);
		} else {
			var row = results[0][0];
			if (0 !== Number(row.RES)) {
				code = row.CODE;
				msg = row.MSG;
				PRINT_LOG.error(__filename, "MYSQL_SLP_ACCOUNT_CONN.procIsAllowAPP, DB error : " + code, msg);
			} else {
				if (1 === Number(row.IS_ALLOW_APP)) {
					isSuccess = true;
				} else {
					isSuccess = false;
				}
			}
		}
		callBack(isSuccess);
	});
};

var isValidEmail = function(value) {
	"use strict";

	if (isNull(value)) {
		return false;
	}

	var reg_exp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
	// var reg_exp=/^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
	// var reg_exp = /^[\w!#$%&\'*+\/=?^`{|}~.-]+@(?:[ a-z\d][ a-z\d-]*(?:\.[ a-z\d][ a-z\d-]*)?)+\.(?:[a-z][a-z\d-]+)$/i;

	return reg_exp.test(value);
};

var isValidNumber = function(value) {
	"use strict";

	if (isNull(value) || isNaN(value)) {
		return false;
	}

	var reg_exp = /^[0-9]+$/g;
	return reg_exp.test(value);
};

var isValidPassword = function(value) {
	"use strict";

	if (isNull(value)) {
		return false;
	}

	var len = value.length;
	if ((6 > len) || (32 < len)) {
		return false;
	}

	return true;
};

var isValidCountry = function(value) {
	"use strict";

	if (isNull(value)) {
		return false;
	}

	var len = value.length;
	if (2 !== len) {
		return false;
	}

	var reg_exp = /^[A-Za-z_]+$/g;
	return reg_exp.test(value);
};

var isValidSignupPath = function(value) {
	"use strict";

	if (isNull(value)) {
		return false;
	}

	if (("slp" === value) || ("facebook" === value) || ("google" === value)) {
		return true;
	}

	return false;
};

var isValidProfileName = function(value) {
	"use strict";

	if (isNull(value)) {
		return false;
	}

	var len = value.length;
	if ((1 > len) || (32 < len)) {
		return false;
	}

	var reg_exp = /^[~!@\#$%<>^&*\()\-=+\’]/;
	if (reg_exp.test(value)) {
		return false;
	} else {
		return true;
	}
};


var isValidDate = function(value) {
	"use strict";

	if (isNull(value)) {
		return false;
	}

	var reg_exp = /^(19[7-9][0-9]|2\d{3})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
	return reg_exp.test(value);
};

var isValidGender = function(value) {
	"use strict";

	if (isNull(value)) {
		return false;
	}

	if ("m" === value || "M" === value || "f" === value || "F" === value) {
		return true;
	} else {
		return false;
	}
};

var isValidClientUID = function(value) {
	"use strict";

	if (isNull(value)) {
		return false;
	}

	var len = value.length;
	if ((0 > len) || (64 < len)) {
		return false;
	} else {
		return true;
	}
};

// checked
var convertAppIDtoLevel = function(appID) {
	if (isNull(appID)) return -1;
	if (1000000003 === Number(appID)) return 1;
	if (1000000004 === Number(appID)) return 2;
	if (1000000005 === Number(appID)) return 3;
	if (1000000006 === Number(appID)) return 4;
	return -1;
};

// checked
var trim = function(str) {
	if (isNull(str)) return null;
	if ("string" === typeof str) return str.replace(/(^\s*)|(\s*$)/gi, "");
	return null;
};

// checked
var trimCountry = function(countryCode) {
	var trimStr = trim(countryCode);
	if (isNull(trimStr)) return null;
	if ("string" === typeof trimStr) return trimStr.toUpperCase();
	return null;
};

// checked
var isValidOS = function(str) {
	if (isNull(str)) return false;
	str = trim(str);
	return ("android") === str || ("ios" === str);
};

var isValidAppID = function(appID) {
	if (isNull(appID)) return false;
	var level = convertAppIDtoLevel(appID);
	return !((0 >= Number(level)) || (4 < Number(level)));
};

var isValidGuest = function(isGuest) {
	"use strict";
	if (isNull(isGuest) || isNaN(isGuest)) {
		return false;
	} else {
		if ((0 === Number(isGuest)) || (1 === Number(isGuest))) {
			return true;
		} else {
			return false;
		}
	}
};

var isValidSlpAccountID = function(slpAccountID) {
	"use strict";
	if (isNull(slpAccountID) || isNaN(slpAccountID)) {
		return false;
	} else {
		if (0 < Number(slpAccountID)) {
			return true;
		} else {
			return false;
		}
	}
};

var isValidProfileID = function(userID) {
	"use strict";
	return isValidSlpAccountID(userID);
};

var isValidUserID = function(userID) {
	"use strict";
	return isValidSlpAccountID(userID);
};

var isValidAccessToken = function(authToken) {
	"use strict";
	if (isNull(authToken)) {
		return false;
	} else {
		if (40 === authToken.length) {
			return true;
		} else {
			return false;
		}
	}
};

var getMysqlRES = function(results) {
	"use strict";

	var resData = {};
	resData.res = -9999999;
	resData.msg = "";
	resData.erroe_level = "";
	resData.erroe_code = "";
	resData.erroe_msg = "";


	if (isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
		resData.result = -1;
		resData.msg = " db results is null";
	} else {
		var resultsLength = results.length;
		for (var i = 0; i < resultsLength - 1; i++) {
			if (isNull(results[i][0]["RES"])) {
				if (!isNull(results[i][0]["Level"])) {
					resData.erroe_level = results[i][0]["Level"];
				}
				if (!isNull(results[i][0]["Code"])) {
					resData.erroe_code = results[i][0]["Code"];
				}
				if (!isNull(results[i][0]["Message"])) {
					resData.erroe_msg = results[i][0]["Message"];
				}
			} else {
				resData.res = Number(results[i][0]["RES"]);
				if (0 != resData.res) {
					resData.msg = results[i][0]["MSG"];
				}
			}
		}
	}
	resData.msg = resData.msg + ", SHOW ERRORS " + resData.erroe_level + ", " + resData.erroe_code + ", " + resData.erroe_msg;
	return resData;
};


var getEpisodeInfo = function(episodeID) {
	"use strict";
	var len = global.EPISODE_LIST.length;
	for (var i = 0; i < len; i++) {
		if (episodeID === global.EPISODE_LIST[i].EPISODE_ID) {
			return global.EPISODE_LIST[i];
		}
	}
	return null;
};

var isValidPackageID = function(store, packageID) {
	"use strict";
	if (isNull(store) || isNull(packageID) || isNaN(packageID)) {
		return false;
	} else {
		packageID = Number(packageID);
		var len = global.SHOP_PACKAGE_LIST.length;
		for (var i = 0; i < len; i++) {
			if ((store === global.SHOP_PACKAGE_LIST[i].STORE) && (packageID === global.SHOP_PACKAGE_LIST[i].PACKAGE_ID) && (0 !== global.SHOP_PACKAGE_LIST[i].STATE)) {
				return true;
			}
		}
	}
	return false;
};

var isValidStore = function(store) {
	"use strict";
	if (isNull(store)) {
		return false;
	} else if (("google" === store) || ("apple" === store)) {
		return true;
	}
	else {
		return false;
	}
};


var isValidBuild = function(build) {
	"use strict";
	if (isNull(build)) {
		return false;
	} else if (("google" === build) || ("apple" === build)) {
		return true;
	}
	else {
		return false;
	}
};

var isValidEpisodeID = function(episodeID) {
	"use strict";
	if (isNull(episodeID)) {
		return false;
	} else {
		return true;
	}
};

var isValidChapter = function(chapter) {
	"use strict";
	if (isNull(chapter) || isNaN(chapter)) {
		return false;
	} else if ((0 > Number(chapter) || (3 < Number(chapter)))) {
		return false;
	} else {
		return true;
	}
};

var isValidPlaytime = function(playTime) {
	"use strict";
	if (isNull(playTime) || isNaN(playTime)) {
		return false;
	} else {
		return true;
	}
};


var prepareConsumeResult = function(row) {
	"use strict";
	var resData = {};
	resData.isSuccess = true;
	resData.msg = "";
	resData.res = row.RES;
	//resData.buy_id = row.BUY_ID;
	resData.tickets = prepareTicketQTY(row);
	return resData;
};

var prepareTicketQTY = function(row) {
	"use strict";
	var tickets = [];

	var ticket1 = {};
	ticket1.type = 1;
	if (isNull(row.T1_QTY)) {
		ticket1.qty = -1;
	} else {
		ticket1.qty = row.T1_QTY;
	}
	tickets.push(ticket1);

	var ticket2 = {};
	ticket2.type = 2;
	if (isNull(row.T2_QTY)) {
		ticket2.qty = -1;
	} else {
		ticket2.qty = row.T2_QTY;
	}
	tickets.push(ticket2);

	var ticket3 = {};
	ticket3.type = 3;
	if (isNull(row.T3_QTY)) {
		ticket3.qty = -1;
	} else {
		ticket3.qty = row.T3_QTY;
	}
	tickets.push(ticket3);

	var ticket4 = {};
	ticket4.type = 4;
	if (isNull(row.T4_QTY)) {
		ticket4.qty = -1;
	} else {
		ticket4.qty = row.T4_QTY;
	}
	tickets.push(ticket4);

	return tickets;
};

var getPhotosPath = function(destPathIdx) {
	"use strict";
	if (isNull(destPathIdx) && isNaN(destPathIdx)) {
		return "unknown_idx/";
	} else {
		destPathIdx = Number(destPathIdx);
		if (0 === destPathIdx) {
			return "photos/";
		} else {
			return "unknown_idx/";
		}
	}
};

var isValidCounrtyCodeAlpha2 = function(countryCode) {
	"use strict";
	if (isNull(countryCode)) {
		return false;
	} else {
		var len = global.COUNTRY_CODES.length;
		for (var i = 0; i < len; i++) {
			var obj = global.COUNTRY_CODES[i];
			if (countryCode === obj.alpha2) {
				return true;
			}
		}
	}
	return false;
};

var isValidCounrtyCodeAlpha3 = function(nationCode) {
	"use strict";
	if (isNull(nationCode)) {
		return false;
	} else {
		var len = global.COUNTRY_CODES.length;
		for (var i = 0; i < len; i++) {
			if (code === global.COUNTRY_CODES[i].alpha3) {
				return true;
			}
		}
	}
	return false;
};


const ACTION_TYPE_EPISODE_START = "ep_start";
const ACTION_TYPE_EPISODE_END = "ep_end";
const ACTION_TYPE_CHAPTER_START = "ch_start";
const ACTION_TYPE_CHAPTER_END = "ch_end";
const ACTION_TYPE_APP_BACKGROUND = "app_bg";
const ACTION_TYPE_APP_FOREGROUND = "app_fg";


var isValidActionType = function(actionType) {
	"use strict";
	if (isNull(actionType)) {
		return false;
	} else {
		if ((ACTION_TYPE_EPISODE_START === actionType) || (ACTION_TYPE_EPISODE_END === actionType) ||
			(ACTION_TYPE_CHAPTER_START === actionType) || (ACTION_TYPE_CHAPTER_END === actionType) ||
			(ACTION_TYPE_APP_BACKGROUND === actionType) || (ACTION_TYPE_APP_FOREGROUND === actionType)) {
			return true;
		} else {
			return false;
		}

	}
};


const PING_TYPE_MENU = "menu";      //메뉴화면
const PING_TYPE_EPISODE_PLAY = "ep_play"; // 에피소드 플레이화면(챕터 플레이전)
const PING_TYPE_CHAPTER_PLAY = "ch_play"; // 챕터 시작(챕터 틀레이중)

var isValidPingType = function(pingType) {
	"use strict";
	if (isNull(pingType)) {
		return false;
	} else {
		if ((PING_TYPE_MENU === pingType) || (PING_TYPE_EPISODE_PLAY === pingType) || (PING_TYPE_CHAPTER_PLAY === pingType)) {
			return true;
		} else {
			return false;
		}
	}
};


module.exports = {
	// 유효성 체크	
	isNull: isNull,						// null 체크
	isRegExp: isRegExp,						// 정규식 체크
	calByte: calByte,						// byte 체크
	makePassword: makePassword,                        // 난수 생성
	getWeek: getWeek,
	getClientIP: getClientIP,
	isLoggedIn: isLoggedIn,
	isValidEmail: isValidEmail,
	isValidNumber: isValidNumber,
	isValidPassword: isValidPassword,
	isValidCountry: isValidCountry,
	isValidSignupPath: isValidSignupPath,
	isValidProfileName: isValidProfileName,
	isValidDate: isValidDate,
	isValidGender: isValidGender,
	isValidClientUID: isValidClientUID,
	isValidAllowAPP: isValidAllowAPP,
	trim: trim,
	trimCountry: trimCountry,
	isValidOS: isValidOS,
	isValidAppID: isValidAppID,
	getMysqlRES: getMysqlRES,
	isValidGuest: isValidGuest,
	isValidSlpAccountID: isValidSlpAccountID,
	isValidProfileID: isValidProfileID,
	isValidUserID: isValidUserID,
	isValidAccessToken: isValidAccessToken,
	isValidActionType: isValidActionType,
	getEpisodeInfo: getEpisodeInfo,
	isValidPackageID: isValidPackageID,
	isValidStore: isValidStore,
	isValidBuild: isValidBuild,
	isValidEpisodeID: isValidEpisodeID,
	isValidChapter: isValidChapter,
	isValidPlaytime: isValidPlaytime,
	isValidCounrtyCodeAlpha2: isValidCounrtyCodeAlpha2,
	isValidCounrtyCodeAlpha3: isValidCounrtyCodeAlpha3,
	getUnixTimestamp: getUnixTimestamp,
	prepareConsumeResult: prepareConsumeResult,
	prepareTicketQTY: prepareTicketQTY,
	getPhotosPath: getPhotosPath,
	convertAppIDtoLevel: convertAppIDtoLevel,
	isValidPingType: isValidPingType,
	ACTION_TYPE_EPISODE_START: ACTION_TYPE_EPISODE_START,
	ACTION_TYPE_EPISODE_END: ACTION_TYPE_EPISODE_END,
	ACTION_TYPE_CHAPTER_START: ACTION_TYPE_CHAPTER_START,
	ACTION_TYPE_CHAPTER_END: ACTION_TYPE_CHAPTER_END,
	ACTION_TYPE_APP_BACKGROUND: ACTION_TYPE_APP_BACKGROUND,
	ACTION_TYPE_APP_FOREGROUND: ACTION_TYPE_APP_FOREGROUND,
	PING_TYPE_MENU: PING_TYPE_MENU,
	PING_TYPE_EPISODE_PLAY: PING_TYPE_EPISODE_PLAY,
	PING_TYPE_CHAPTER_PLAY: PING_TYPE_CHAPTER_PLAY
};