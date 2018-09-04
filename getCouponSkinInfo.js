
// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_SLP_COMMON_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_COMMON;


function add_routes(app) {
    "use strict";
    
    app.post("/slp.coupon.getCouponSkinInfo", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res){ 
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
		try {
            var responseOBJ = {};
			var requestParams = {};
			requestParams.lang         = COMMON_UTIL.trim(req.body.language);
			
			var xml2js = require('xml2js');
			var parser = new xml2js.Parser();
			var request = require("request");
			var url;
			
			var couponSkinOptions = "";
			
			if( requestParams.lang == "kr" ) {
				url = global.CONFIG.CDN_INFO.URI + "PLATFORM/data/bae_coupon.xml";
			} else {
				url = global.CONFIG.CDN_INFO.URI + "PLATFORM/data/bae_coupon.xml";
			}
			
			request({
				uri: url,
				method: "GET"
			}, function(error, response, body) {
				parser.parseString(body, function(err, result) {
					var i = 0;
					
					while( i < Number(result.root.coupon[0].skin.length) ) {
						var curSkin = result.root.coupon[0].skin[i];
						couponSkinOptions += '<option value="'+ curSkin.id +'">'+ curSkin.id + '(' +curSkin.support_desc + ')</option>';
						i++;
					}
					responseOBJ.skins = couponSkinOptions;
					PACKET.sendSuccess(req, res, responseOBJ);
				});
			});	
			
			
			

        } catch(catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
    
}

exports.add_routes = add_routes;