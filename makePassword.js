// nodejs npm
const CRYPTO      = require("crypto");

// common
const ROUTE_MIDDLEWARE   = require("../../common/util/route_middleware.js");
const PACKET     = require("../../common/util/packet_sender.js");
const COMMON_UTIL     = require("../../common/util/common.js");
const ERROR_CODE_UTIL     = require("../../common/util/error_code_util.js");
const NODE_MAILER = require('../../common/mail/node_mailer.js');

// log
const PRINT_LOG = global.PRINT_LOGGER;

function add_routes(app) {
    "use strict";

    app.post("/slp.user.make.password", ROUTE_MIDDLEWARE.DEFAULT, function(req, res){
        

        var accountPWD = CRYPTO.createHash("sha512").update("12345").digest("base64");
		
		var responseObj = {};
		responseObj.password = accountPWD;
		PRINT_LOG.debug(accountPWD)
		
        PACKET.sendSuccess(req, res, responseObj);
		
		
    });
}

exports.add_routes = add_routes;