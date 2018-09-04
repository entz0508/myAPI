// nodejs npm

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

function add_routes(app) {
    "use strict";

    app.post("/sdla.shop.productidlist", ROUTE_MIDDLEWARE.DEFAULT, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var os = COMMON_UTIL.trim(req.body.os);
            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientUID = COMMON_UTIL.trim(req.body.client_uid);
            var clientVer = COMMON_UTIL.trim(req.body.c_ver);

            var lev = Number(global.CONFIG.SERVER_INFO.LEVEL);

            var slpAccountID = COMMON_UTIL.trim(req.body.account_id);
            var slpAccountAccessToken = COMMON_UTIL.trim(req.body.account_access_token);
            var userID = COMMON_UTIL.trim(req.body.user_id);
            var userAccessToken = COMMON_UTIL.trim(req.body.user_access_token);
            var store = COMMON_UTIL.trim(req.body.store);




            var responseObj = {};
            responseObj.store = store;
            responseObj.product_id = [];
            var len = global.SHOP_PACKAGE_LIST.length;
            for(var i=0; i<len; i++) {
                if( (store===global.SHOP_PACKAGE_LIST[i].STORE) && (0!==global.SHOP_PACKAGE_LIST[i].STATE) ) {
                    responseObj.product_id.push(global.SHOP_PACKAGE_LIST[i].PRODUCT_ID);
                }
            }
            PACKET.sendSuccess(req, res, responseObj);

        } catch(catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
}

exports.add_routes = add_routes;