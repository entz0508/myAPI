var PRINT_LOG = global.PRINT_LOGGER;

const UNIT_TYPE_ENGLISH = 0;
const UNIT_TYPE_QUIZ = 1;
const MEDAL_CATEGORY_TYPE_PHONICS = 0;
const MEDAL_CATEGORY_TYPE_VOCABULARY = 1;
const MEDAL_CATEGORY_TYPE_SENTENCE = 2;

var isNull = function isNull(chk_value) {
	return (typeof chk_value === "undefined") || (null === chk_value) || (undefined === chk_value) || ("" === chk_value);
};

var isRegExp = function isRegExp(type, value) {
	if (isNull(value)) return false;
	
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
	} else if (type === 'password') { // 비밀번호 (특수기호 제외하고 7~21)
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
		reg_exp = /(\W|^)([3456])(\W|$)/;
	} else {
		return false;
	}
	
	return reg_exp.test(value);
};

var calByte = function(chk_value) {
	var tmp_str = chk_value;
	var tmp_len = tmp_str.length;
	var one_chr;
	var tot_cnt = 0;
	
	for (var i = 0; i < tmp_len; i++) {
		one_chr = tmp_str.charAt(i);
		if (escape(one_chr).length > 4) {
			tot_cnt += 2;
		} else if (one_chr !== '\r') {
			tot_cnt++;
		}
	}
	return tot_cnt;
};

var makePassword = function(pwdLength, isSpecialChar) {
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
	
	return password.toLowerCase();
};

var getWeek = function(date) {
	var onejan = new Date(date.getFullYear(), 0, 1);
	return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};


var getUnixTimestamp = function() {
	return Math.floor(new Date().getTime() / 1000);
};

var getClientIP = function(req) {
	if (!isNull(req.headers['x-forwarded-for'])) return req.headers['x-forwarded-for'];
	if (!isNull(req._remoteAddress)) return req._remoteAddress;
	return "0.0.0.0";
};

var isLoggedIn = function(MYSQL_DLA_CONN, appID, os, clientUID, accountID, accessToken, callBack) {
	MYSQL_DLA_CONN.procIsLoggedIn(appID, os, clientUID, accountID, accessToken, function(err, results) {
		var isSuccess = false;
		if (err) {
			PRINT_LOG.setErrorLog("MYSQL_SLP_ACCOUNT_CONN.procIsLoginUserAccount, failed db, code:" + -1, err);
		} else if (isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
			PRINT_LOG.error(__filename, "", "MYSQL_SLP_ACCOUNT_CONN.procAuthAppID, results is null, \t\t [ " + __filename + "]");
		} else {
			var row = results[0][0];
			if (0 === Number(row.RES)) {
				isSuccess = Number(userID) === Number(row.USER_ID);
			} else {
				PRINT_LOG.error(__filename, "", "MYSQL_SLP_ACCOUNT_CONN.procIsLoginUserAccount, DB error : " + row.RES, ", msg:" + row.MSG);
			}
		}
		callBack(isSuccess);
	});
};

var isValidAllowAPP = function(MYSQL_SLP_ACCOUNT_CONN, appID, clientIdentifier, clientIP, accountID, accessToken, callBack) {
	MYSQL_SLP_ACCOUNT_CONN.procIsAllowAPP(appID, clientIdentifier, clientIP, accountID, accessToken, function(err, results) {
		var isSuccess = false;
		if (err) {
			PRINT_LOG.setErrorLog("MYSQL_SLP_ACCOUNT_CONN.procIsAllowAPP, failed db, code:" + -1, err);
		} else if (isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
			PRINT_LOG.error(__filename, "", "MYSQL_SLP_ACCOUNT_CONN.procIsAllowAPP, results is null, \t\t [ " + __filename + "]");
		} else {
			var row = results[0][0];
			if (0 !== Number(row.RES)) {
				PRINT_LOG.error(__filename, "MYSQL_SLP_ACCOUNT_CONN.procIsAllowAPP, DB error : " + row.CODE, row.MSG);
			} else {
				isSuccess = 1 === Number(row.IS_ALLOW_APP);
			}
		}
		callBack(isSuccess);
	});
};

var isValidEmail = function(value) {
	return !isNull(value) && /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(value);
};

var isValidNumber = function(value) {
	return !(isNull(value) || isNaN(value)) && /^[0-9]+$/g.test(value);
};

var isValidPassword = function(value) {
	if (isNull(value)) return false;
	var len = value.length;
	return !((6 > len) || (32 < len));
};

var isValidCountry = function(value) {
	return isValidCounrtyCodeAlpha2(value);
};

var isValidSignupPath = function(value) {
	return !isNull(value) && ("slp" === value) || ("facebook" === value) || ("google" === value);
};

var isValidProfileName = function(value) {
	if (isNull(value)) return false;
	var len = value.length;
	return !((1 > len) || (32 < len)) && !/^[~!@\#$%<>^&*\()\-=+\’]/.test(value);
};

var isValidDate = function(value) {
	return !isNull(value) && /^(19[7-9][0-9]|2\d{3})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(value);
};

var isValidGender = function(value) {
	return !isNull(value) && "m" === value || "M" === value || "f" === value || "F" === value;
};

var isValidClientUID = function(value) {
	if (isNull(value)) return false;
	var len = value.length;
	return !((0 > len) || (64 < len));
};

var trim = function(str) {
	if (isNull(str)) return null;
	if ("string" === typeof str) return str.replace(/(^\s*)|(\s*$)/gi, "");
	return null;
};

var isValidOS = function(str) {
	if (isNull(str)) return false;
	str = trim(str);
	return ("android") === str || ("ios" === str);
};

var isValidAppID = function(appID) {
	if (isNull(appID)) return false;
	for (var i = 0, len = global.CONFIG.SERVER_INFO.APP_ID.length; i < len; i++) {
		if (Number(global.CONFIG.SERVER_INFO.APP_ID[i]) === Number(appID) || Number(appID) === 1000000001) return true;
	}
	return false;
};

var isValidGuest = function(isGuest) {
	return !(isNull(isGuest) || isNaN(isGuest)) && (0 === Number(isGuest)) || (1 === Number(isGuest));
};

var isValidQuestID = function(questID) {
	return !(isNull(questID) || isNaN(questID));
};

var isValidAccountID = function(accountID) {
	return !(isNull(accountID) || isNaN(accountID)) && 0 < Number(accountID);
};

var isValidProfileID = function(userID) {
	return isValidAccountID(userID);
};

var isValidUserID = function(userID) {
	return isValidAccountID(userID);
};

var isValidAccessToken = function(authToken) {
	return !isNull(authToken);
};

var isValidDeviceToken = function(deviceToken) {
	return !isNull(deviceToken);
};

var getMysqlRES = function(results) {
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
				if (0 !== resData.res) {
					resData.msg = results[i][0]["MSG"];
				}
			}
		}
	}
	resData.msg = resData.msg + ", SHOW ERRORS " + resData.erroe_level + ", " + resData.erroe_code + ", " + resData.erroe_msg;
	return resData;
};

var getEpisodeInfo = function(episodeID) {
	var len = global.EPISODE_LIST.length;
	for (var i = 0; i < len; i++) {
		if (episodeID === global.EPISODE_LIST[i].EPISODE_ID) {
			return global.EPISODE_LIST[i];
		}
	}
	return null;
};

var isValidPackageID = function(store, packageID) {
	if (isNull(store) || isNull(packageID) || isNaN(packageID)) {
		return false;
	}
	packageID = Number(packageID);
	var len = global.SHOP_PACKAGE_LIST.length;
	for (var i = 0; i < len; i++) {
		if ((store === global.SHOP_PACKAGE_LIST[i].STORE) && (packageID === global.SHOP_PACKAGE_LIST[i].PACKAGE_ID) && (0 !== global.SHOP_PACKAGE_LIST[i].STATE)) {
			return true;
		}
	}
	return false;
};

var isValidStore = function(store) {
	return !isNull(store) && ("google" === store) || ("apple" === store);
};

var isValidBuild = function(build) {
	return !isNull(build) && ("google" === build) || ("apple" === build);
};

var isValidHomeschoolStatus = function(status) {
	return !(isNull(status) || isNaN(status)) && !((0 > Number(status)) || (1 < Number(status)));
};

var isValidStepID = function(stepID) {
	if (isNull(stepID)) return false;
	for (var i = 0, len = global.XML_UNIT_ABC_LIST.length; i < len; i++) {
		if (stepID === global.XML_UNIT_ABC_LIST[i].STEP_ID) return true;
	}
	return false;
};

var isValidEpisodeID = function(episodeID) {
	if (isNull(episodeID)) return false;
	for (var i = 0, len = global.XML_EPISODE_LIST.length; i < len; i++) {
		if (episodeID === global.XML_EPISODE_LIST[i].EPISODE_ID) return true;
	}
	return true;
};

var isValidStepEpisodeID = function(stepID, episodeID) {
	if (isNull(episodeID)) return false;
	for (var i = 0, len = global.XML_EPISODE_LIST.length; i < len; i++) {
		if ((episodeID === global.XML_EPISODE_LIST[i].EPISODE_ID) && (stepID === global.XML_EPISODE_LIST[i].STEP_ID)) return true;
	}
	return true;
};

var isValidChapter = function(chapter) {
	return !(isNull(chapter) || isNaN(chapter)) && (!(0 > Number(chapter) || (3 < Number(chapter))));
};

var isValidPlaytime = function(playTime) {
	return !(isNull(playTime) || isNaN(playTime));
};


var prepareConsumeResult = function(row) {
	var resData = {};
	resData.isSuccess = true;
	resData.msg = "";
	resData.res = row.RES;
	//resData.buy_id = row.BUY_ID;
	resData.tickets = prepareTicketQTY(row);
	return resData;
};

var prepareTicketQTY = function(row) {
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

var isValidCounrtyCodeAlpha2 = function(nationCode) {
	// 국가코드가 의미가 없어져서 입힌 코드
	return true;
	
	if (isNull(nationCode)) {
		return false;
	} else {
		var code = nationCode.toUpperCase();
		var len = global.COUNTRY_CODES.length;
		for (var i = 0; i < len; i++) {
			if (code === global.COUNTRY_CODES[i].alpha2) {
				return true;
			}
		}
	}
	return false;
};

var isValidCounrtyCodeAlpha3 = function(nationCode) {
	if (isNull(nationCode)) return false;
	for (var i = 0, code = nationCode.toUpperCase(), len = global.COUNTRY_CODES.length; i < len; i++) {
		if (code === global.COUNTRY_CODES[i].alpha3) return true;
	}
	return false;
};


const ACTION_TYPE_EPISODE_START = "ep_start";
const ACTION_TYPE_EPISODE_END = "ep_start";
const ACTION_TYPE_CHAPTER_START = "ep_start";
const ACTION_TYPE_CHAPTER_END = "ep_start";
const ACTION_TYPE_APP_BACKGROUND = "app_bg";
const ACTION_TYPE_APP_FOREGROUND = "app_fg";


var isValidActionType = function(actionType) {
	return !isNull(actionType) &&
		(ACTION_TYPE_EPISODE_START === actionType) || (ACTION_TYPE_EPISODE_END === actionType) ||
		(ACTION_TYPE_CHAPTER_START === actionType) || (ACTION_TYPE_CHAPTER_END === actionType) ||
		(ACTION_TYPE_APP_BACKGROUND === actionType) || (ACTION_TYPE_APP_FOREGROUND === actionType);
};

var getResDataObj = function() {
	var resData = {};
	resData.isSuccess = false;
	resData.err = null;
	resData.res = -1;
	resData.msg = "";
	return resData;
};

var isQuizType = function(typeName, quizID) {
	if (isNull(typeName) || isNull(quizID) || isNaN(quizID)) return false;
	for (var i = 0, id = Number(quizID), len = global.XML_QUIZ_LIST.length; i < len; i++) {
		var quiz = global.XML_QUIZ_LIST[i];
		if ((id === quiz.QUIZ_ID) && (typeName === quiz.MEDAL_CATEGORY)) return true;
	}
	return false;
};

var isQuizTypePhonics = function(quizID) {
	return isQuizType(MEDAL_CATEGORY_TYPE_PHONICS, quizID);
};

var isQuizTypeVocabulary = function(quizID) {
	return isQuizType(MEDAL_CATEGORY_TYPE_VOCABULARY, quizID);
};

var isQuizTypeSentence = function(quizID) {
	return isQuizType(MEDAL_CATEGORY_TYPE_SENTENCE, quizID);
};

var getStepAllQuizList = function(stepID) {
	var list = [];
	var len = global.XML_QUIZ_LIST.length;
	for (var i = 0; i < len; i++) {
		if ((stepID === global.XML_QUIZ_LIST[i].UNIT_ID)) {
			list.push({ id: global.XML_QUIZ_LIST[i].QUIZ_ID, result: -1 });
		}
	}
	return list;
};

var getMedalList = function(typeName) {
	var list = [];
	for (var i = 0, len = global.XML_MEDAL_LIST.length; i < len; i++) {
		if (isMedalType(typeName, global.XML_MEDAL_LIST[i].MEDAL_ID)) {
			list.push({ id: global.XML_MEDAL_LIST[i].MEDAL_ID, status: -1 });
		}
	}
	return list;
};

var isMedalType = function(typeName, medalID) {
	if (isNull(typeName) || isNull(medalID) || isNaN(medalID)) return false;
	var obj = global.XML_MEDAL_MAP.get(medalID);
	return !isNull(obj) && typeName === obj.MEDAL_CATEGORY;
};

var isMedalTypePhonics = function(medalID) {
	return isMedalType(MEDAL_CATEGORY_TYPE_PHONICS, medalID);
};

var isMedalTypeVocabulary = function(medalID) {
	return isMedalType(MEDAL_CATEGORY_TYPE_VOCABULARY, medalID);
};

var isMedalTypeSentence = function(medalID) {
	return isMedalType(MEDAL_CATEGORY_TYPE_SENTENCE, medalID);
};

var getEpisodeStepID = function(episodeID) {
	var epObj = global.XML_EPISODE_MAP.get(episodeID);
	if (isNull(epObj)) return null;
	return epObj.STEP_ID;
};

var calcPercent = function(value, sumValue) {
	if (isNull(value) || isNull(sumValue) || isNaN(value) || isNaN(sumValue) || 0 === Number(sumValue)) return 0;
	return Math.floor(value / sumValue * 100);
};

var calcDiv = function(value, sumValue) {
	if (isNull(value) || isNull(sumValue) || isNaN(value) || isNaN(sumValue) || 0 === Number(sumValue)) return 0;
	return Math.floor(value / sumValue);
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
	isValidOS: isValidOS,
	isValidAppID: isValidAppID,
	getMysqlRES: getMysqlRES,
	isValidGuest: isValidGuest,
	isValidAccountID: isValidAccountID,
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
	isValidDeviceToken: isValidDeviceToken,
	getUnixTimestamp: getUnixTimestamp,
	prepareConsumeResult: prepareConsumeResult,
	prepareTicketQTY: prepareTicketQTY,
	getPhotosPath: getPhotosPath,
	getResDataObj: getResDataObj,
	isQuizTypePhonics: isQuizTypePhonics,
	isQuizTypeVocabulary: isQuizTypeVocabulary,
	isQuizTypeSentence: isQuizTypeSentence,
	isMedalTypePhonics: isMedalTypePhonics,
	isMedalTypeVocabulary: isMedalTypeVocabulary,
	isMedalTypeSentence: isMedalTypeSentence,
	calcPercent: calcPercent,
	calcDiv: calcDiv,
	getEpisodeStepID: getEpisodeStepID,
	getStepAllQuizList: getStepAllQuizList,
	isValidStepID: isValidStepID,
	isValidStepEpisodeID: isValidStepEpisodeID,
	isValidHomeschoolStatus: isValidHomeschoolStatus,
	getMedalList: getMedalList,
	isValidQuestID: isValidQuestID,
	
	ACTION_TYPE_EPISODE_START: ACTION_TYPE_EPISODE_START,
	ACTION_TYPE_EPISODE_END: ACTION_TYPE_EPISODE_END,
	ACTION_TYPE_CHAPTER_START: ACTION_TYPE_CHAPTER_START,
	ACTION_TYPE_CHAPTER_END: ACTION_TYPE_CHAPTER_END,
	ACTION_TYPE_APP_BACKGROUND: ACTION_TYPE_APP_BACKGROUND,
	ACTION_TYPE_APP_FOREGROUND: ACTION_TYPE_APP_FOREGROUND,
	UNIT_TYPE_ENGLISH: UNIT_TYPE_ENGLISH,
	UNIT_TYPE_QUIZ: UNIT_TYPE_QUIZ,
	MEDAL_CATEGORY_TYPE_PHONICS: MEDAL_CATEGORY_TYPE_PHONICS,
	MEDAL_CATEGORY_TYPE_VOCABULARY: MEDAL_CATEGORY_TYPE_VOCABULARY,
	MEDAL_CATEGORY_TYPE_SENTENCE: MEDAL_CATEGORY_TYPE_SENTENCE
};