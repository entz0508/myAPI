const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");


var makeURL = function( baseURL, targetPath, targetPort) {

    var url = baseURL;
    var path = targetPath;

    if(443 === Number(targetPort)) {
        url = "https://" + url + "/" + path;
    } else if(80 === Number(targetPort)) {
        url = "http://" + url + "/" + path;
    } else {
        url = "http://" + url + ":" + Number(targetPort) + "/" + path;
    }
    return url;
};

var httpIsLoggedInSlpAccount = function(appID, clientUID, slpAccountID, slpAccountAccessToken, slpProfileID, callBack){
    isLoggedInSlpAccount(appID, clientUID, slpAccountID, slpAccountAccessToken, slpProfileID, function(err, httpResponseJson){
        var resData = {};
        resData.res = -1;
        resData.isLoggedIn = false;
        resData.isKidswattsAppLoggedIn = false;
        if(err) {
            resData.res = -1;
            resData.msg = " error, http request, isLoggedInSlpAccount, [" + httpResponseJson.url + "], " + __filename;
        } else {
            resData.res = Number(httpResponseJson.res);
            if(ERROR_CODE_UTIL.RES_SUCCESS !== resData.res) {
                resData.msg = httpResponseJson.msg;
            } else {
                if(1 === Number(httpResponseJson.is_logged_in)) {
                    resData.isLoggedIn = true;
                }
                if(1 === Number(httpResponseJson.is_kidswatts_app_logged_in)) {
                    resData.isKidswattsAppLoggedIn = true;
                }

            }
        }
        callBack(err, resData);
    });
};

var isLoggedInSlpAccount= function(appID, clientUID, slpAccountID, slpAccountAccessToken, slpProfileID, callBack) {
    const PRINT_LOG = global.PRINT_LOGGER;

    var url = makeURL(global.CONFIG.SLP_PLATFORM.URL, global.CONFIG.SLP_PLATFORM.PATH_IS_AUTH_SLP_ACCOUNT, Number(global.CONFIG.SLP_PLATFORM.PORT) );

    var request = require("request");
    request({
        uri: url,
        method: "POST",
        form: {
            app_id: Number(appID),
            client_uid: clientUID,
            account_id: slpAccountID,
            access_token: slpAccountAccessToken,
            pf_id : slpProfileID
        }
    }, function(error, response, body) {
        if(error) {
            PRINT_LOG.setErrorLog(__filename + "isLoggedInSlpAccount, error request, url:" + url, error);
            callBack(error,null);
        } else {
            var errObj = null;
            var responseJson = {};
            if(COMMON_UTIL.isNull(body)) {
                responseJson.res = ERROR_CODE_UTIL.RES_FAILED_HTTP_REQUEST;
                responseJson.msg = "http response body is null";
            } else {
                try {
                    responseJson = JSON.parse(body);
                } catch (exception) {
                    errObj = exception;
                    PRINT_LOG.info(__filename,"",body);
                    responseJson = null;
                }
            }
            callBack(errObj,responseJson);
        }
    });
};


module.exports = {
	// 유효성 체크	
    httpIsLoggedInSlpAccount	: httpIsLoggedInSlpAccount
};