const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_DLA_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA;


function ConsumeApple() {
    "use strict";
}

ConsumeApple.prototype.consume = function(API_PATH, appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, build, store, packageID, receipt, callBack) {
    "use strict";

    var paramString = ", userID:" + userID + ", userAccessToken:" + userAccessToken +
                        ", slpAccountID:" + slpAccountID +  ", slpAccountAccessToken:"+ slpAccountAccessToken +
                        ", build:" + build + ", store:" + store + ", packageID:" + packageID + ", receipt:" + receipt;

    checkAppleVerifyReceipt(API_PATH, global.CONFIG.SERVER_INFO.SHOP_APPLE_VERIFY_RECEIPT_URL_LIVE, receipt, function(resDataLive){
        if(resDataLive.isSuccess && (0 === Number(resDataLive.status))) {
            consumeAppleProcDB(API_PATH, appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, build, store, packageID, receipt, callBack);
        } else {
            if(21007 === Number(resDataLive.status) ) {
                PRINT_LOG.info(__filename, "consumeApple.checkAppleVerifyReceipt, failed Live Apple Store, retry Sandbox Apple Store" + paramString );

                checkAppleVerifyReceipt(API_PATH, global.CONFIG.SERVER_INFO.SHOP_APPLE_VERIFY_RECEIPT_URL_SANDBOX, receipt, function (resDataSandBox) {
                    if (resDataSandBox.isSuccess && (0 === Number(resDataSandBox.status))) {
                        consumeAppleProcDB(API_PATH, appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, build, store, packageID, receipt, callBack);
                    } else {
                        PRINT_LOG.info(__filename, "consumeApple.checkAppleVerifyReceipt, failed Sandbox Apple Store" + paramString);
                        callBack(resDataSandBox);
                    }
                });
            } else {
                PRINT_LOG.info(__filename, "consumeApple.checkAppleVerifyReceipt, failed Apple Inapp Error Status : " + resDataLive.status + ", " + paramString);
                callBack(resDataLive);
            }

        }
    });
};

var appleVerifyReceipt = function(url, receiptData, callBack) {
    "use strict";

    var receiptEnvelope = {
        "receipt-data": receiptData
    };
    var receiptEnvelopeStr = JSON.stringify(receiptEnvelope);
    var options = {
        host: url,
        port: 443,
        path: '/verifyReceipt',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': receiptEnvelopeStr.length
        }
    };

    var https = require('https');
    var req = https.request(options, function(res) {
        var buffer = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            if(Number(res.statusCode) === 200) {
                buffer += chunk;
            } else {
                PRINT_LOG.error(__filename, "appleVerifyReceipt, error respones, url: " + url + ", statusCode:" + res.statusCode);
            }
        });
        res.on('end', function () {
            callBack(null, buffer);
        });
        res.on('error', function (error) {
            callBack(error, null);
        });
    });

    req.on('error', function(e) {
        PRINT_LOG.setErrorLog(__filename + "appleVerifyReceipt, error request, url:" + url, e);
    });

    req.write(receiptEnvelopeStr);
    req.end();
};

var getReceiptResponesToJsonObject = function(api_path, url, response) {
    var retV = {};
    retV.isParse = false;
    retV.receipt = null;
    retV.status = -1;

    try {
        retV.receipt = JSON.parse(response);
        retV.isParse = true;
        if( !COMMON_UTIL.isNull(retV.receipt) && !isNaN(retV.receipt.status) ) {
            retV.status = Number(retV.receipt.status);
        }
        return retV;
    }
    catch(errParse) {
        retV.isParse = false;
        var msg = "[" + __filename + "], [" + api_path + "] error, apple response parse, url:" + url + ", response:" + response ;
        PRINT_LOG.setErrorLog(msg, errParse);
        return retV;
    }
};

var checkAppleVerifyReceipt = function(api_path, url, receiptData, callBack) {
    "use strict";

    if( global.DEV_LOCAL_SHOP ) {
        PRINT_LOG.error(__filename, "ENABLE global.DEV_LOCAL_SHOP");
        var tmpResponse = "{\"isParse\": true,\"receipt\": {\"status\": 0,\"environment\": \"Sandbox\",\"receipt\": {\"receipt_type\": \"ProductionSandbox\",\"adam_id\": 0,\"app_item_id\": 0,\"bundle_id\": \"com.blueark.plugintest\",\"application_version\": \"2.7.0\",\"download_id\": 0,\"version_external_identifier\": 0,\"request_date\": \"2015-04-03 04:26:58 Etc/GMT\",\"request_date_ms\": \"1428035218173\",\"request_date_pst\": \"2015-04-02 21:26:58 America/Los_Angeles\",\"original_purchase_date\": \"2013-08-01 07:00:00 Etc/GMT\",\"original_purchase_date_ms\": \"1375340400000\",\"original_purchase_date_pst\": \"2013-08-01 00:00:00 America/Los_Angeles\",\"original_application_version\": \"1.0\",\"in_app\": [{\"quantity\": \"1\",\"product_id\": \"ep101\",\"transaction_id\": \"1000000143645893\",\"original_transaction_id\": \"1000000143645893\",\"purchase_date\": \"2015-04-03 04:26:47 Etc/GMT\",\"purchase_date_ms\": \"1428035207000\",\"purchase_date_pst\": \"2015-04-02 21:26:47 America/Los_Angeles\",\"original_purchase_date\": \"2015-02-16 13:48:44 Etc/GMT\",\"original_purchase_date_ms\": \"1424094524000\",\"original_purchase_date_pst\": \"2015-02-16 05:48:44 America/Los_Angeles\",\"is_trial_period\": \"false\"}]}},\"status\": 0}";
        var responseJson = getReceiptResponesToJsonObject(api_path, url, tmpResponse);
        var resData = {};
        resData.isSuccess = true;
        resData.status = responseJson.status;
        resData.receipt = responseJson.receipt;
        callBack(resData);
    } else {
        appleVerifyReceipt(url, receiptData, function (error, response) {
            var resData = {};
            resData.isSuccess = false;
            resData.msg = "[" + api_path + "] failed Verify url:" + url;
            resData.errorCode = ERROR_CODE_UTIL.RES_FAILED_DB;
            resData.status = -1;
            resData.receipt = null;

            //PRINT_LOG.info(__filename, "\nTEST consume Apple response:" + JSON.stringify(response));
            if (error) {
                resData.msg = "[" + api_path + "] failed Verify url:" + url + ", error msg:" + error.message;
                PRINT_LOG.error(__filename, "consumeApple.appleVerifyReceipt, msg:" + resData.msg);
                resData.errorCode = ERROR_CODE_UTIL.RES_FAILED_VERIFY_PAYMENT_APPLE;
                callBack(resData);
            } else if (ERROR_UTIL.isNull(response)) {
                resData.msg = "[" + api_path + "] failed Verify url:" + url + ", response is null";
                PRINT_LOG.error(__filename, "consumeApple.appleVerifyReceipt, msg:" + resData.msg);
                resData.errorCode = ERROR_CODE_UTIL.RES_FAILED_VERIFY_PAYMENT_APPLE;
                callBack(resData);
            } else {
                var responseJson = getReceiptResponesToJsonObject(api_path, url, response);

                if (responseJson.isParse && !COMMON_UTIL.isNull(responseJson.receipt) && (0 === Number(responseJson.status))) {
                    resData.isSuccess = true;
                    resData.status = responseJson.status;
                    resData.receipt = responseJson.receipt;
                    callBack(resData);
                } else {
                    if (responseJson.isParse) {
                        resData.msg = "[" + api_path + "] failed Verify. error status. url:" + url + ", status:" + responseJson.status;
                    } else {
                        resData.msg = "[" + api_path + "] failed Verify. error response parse url:" + url + ", status:" + responseJson.status;
                    }

                    PRINT_LOG.error(__filename, "consumeApple.appleVerifyReceipt, msg:" + resData.msg);
                    resData.errorCode = ERROR_CODE_UTIL.RES_FAILED_VERIFY_PAYMENT_APPLE;
                    resData.status = responseJson.status;
                    callBack(resData);
                }
            }
        });
    }
};

var consumeAppleProcDB = function(API_PATH, appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, build, store, packageID, receipt, callBack) {
    "use strict";

    var paramString = ", userID:" + userID + ", userAccessToken:" + userAccessToken +
        ", slpAccountID:" + slpAccountID +  ", slpAccountAccessToken:"+ slpAccountAccessToken +
        ", build:" + build + ", store:" + store + ", packageID:" + packageID + ", receipt:" + receipt;

    var payload = "";
    var orderID = "";
    var originalPurchaseDateMS = 0;

    if(global.DEV_LOCAL_SHOP) {
        PRINT_LOG.info(__filename, "ENABLE global.DEV_LOCAL_SHOP");
        var d = new Date();
        payload = "DEV TEST" + d.getTime();
        orderID = d.getTime();
        originalPurchaseDateMS = d.getTime();
    } else {
        var inAppLen = receipt.receipt.in_app.length;
        for(var inAppIdx=0; inAppIdx<inAppLen; inAppIdx++) {
            if( (productID === receipt.receipt.in_app[inAppIdx].product_id) &&
                (Number(originalPurchaseDateMS) < Number(receipt.receipt.in_app[inAppIdx].original_purchase_date_ms)) ) {
                payload = receipt.receipt.in_app[inAppIdx].original_transaction_id;
                orderID = receipt.receipt.in_app[inAppIdx].transaction_id;
                originalPurchaseDateMS = Number(receipt.receipt.in_app[inAppIdx].original_purchase_date_ms);
            }
        }
    }

    if( COMMON_UTIL.isNull(payload) || COMMON_UTIL.isNull(orderID) ) {
        var msg = "receipt : not found, payload or orderId, " + paramString;
        PRINT_LOG.error( __filename, msg);
        var resData = {};
        resData.isSuccess = false;
        resData.msg = "[" + API_PATH + "] consumeApple, " + msg;
        resData.errorCode = ERROR_CODE_UTIL.RES_FAILED_DB;
        resData.status = -1;
        callBack(resData);
    } else {
        MYSQL_SLP_DLA_CONN.procShopAppleConsume(appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, build, store, packageID, payload, orderID, function(err, results) {
            var resData = {};
            resData.isSuccess = false;
            resData.msg = "unknow error";
            resData.res = -1;
            if (err) {
                resData.msg = "Failed, MYSQL_SLP_DLA_CONN.procShopAppleConsume";
                PRINT_LOG.setErrorLog(resData.msg, err);
            } else if (COMMON_UTIL.isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
                resData.msg = "MYSQL_SLP_DLA_CONN.procShopAppleConsume, db results is null";
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


module.exports = ConsumeApple;