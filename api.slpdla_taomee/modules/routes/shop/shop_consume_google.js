const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_DLA_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA;


function ConsumeGoogle() {
    "use strict";
}

ConsumeGoogle.prototype.consume = function(API_PATH, appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, build, store, packageID, receipt, signature, callBack) {
    "use strict";

    var receiptData = receipt;
    var receiptSignature = signature;

    var isValid = false;
    if(global.DEV_LOCAL_SHOP) {
        PRINT_LOG.info(__filename, "ENABLE global.DEV_LOCAL_SHOP, GOOGLEPLAY_PUBLIC_KEY:" + CONFIG.SERVER_INFO.GOOGLEPLAY_PUBLIC_KEY);
        isValid = true;
    } else {
        var IABVerifier = require('iab_verifier');
        var googlePlayVerifier = new IABVerifier(global.CONFIG.SERVER_INFO.GOOGLEPLAY_PUBLIC_KEY);
        isValid = googlePlayVerifier.verifyReceipt(receiptData, receiptSignature);
    }

    if( !isValid ) {
        var resData = {};
        resData.isSuccess = false;
        resData.msg = "[" + API_PATH + "] failed Verify : " + store + ", publicKey:" + global.CONFIG.SERVER_INFO.GOOGLEPLAY_PUBLIC_KEY + ", receiptData:" + receiptData + ", receiptSignature:" + receiptSignature;
        resData.res = ERROR_CODE_UTIL.RES_FAILED_SHOP_GOOGLE_PLAY_VERIFIER;
        callBack(resData);
    } else {
        var orderID = "";
        var payload = "";
        if(global.DEV_LOCAL_SHOP) {
            orderID = COMMON_UTIL.getUnixTimestamp();
            payload = receipt;
        } else {
            var obj = JSON.parse(receipt);
            orderID = obj.orderId;
            payload = obj.developerPayload;
        }


        MYSQL_SLP_DLA_CONN.procShopGoogleConsume(appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken,
            build, store, packageID, payload, orderID, function(err, results) {
                var resData = {};
                resData.isSuccess = false;
                resData.msg = "unknow error";
                resData.res = -1;
                if (err) {
                    resData.msg = "Failed, MYSQL_SLP_DLA_CONN.procShopConsumeGoogle";
                    PRINT_LOG.setErrorLog(resData.msg, err);
                } else if (COMMON_UTIL.isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
                    resData.msg = "MYSQL_SLP_DLA_CONN.procShopConsumeGoogle, db results is null";
                    PRINT_LOG.error(__filename, API_PATH, resData.msg);
                } else {
                    var retV = COMMON_UTIL.getMysqlRES(results);
                    if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                        resData.res = retV.res;
                        resData.msg = retV.msg;
                        PRINT_LOG.error(__filename, API_PATH, resData.msg);
                    } else {
                        resData = COMMON_UTIL.prepareConsumeResult(results[0][0]);
                    }
                }
                callBack(resData);
            });
    }
};


module.exports = ConsumeGoogle;