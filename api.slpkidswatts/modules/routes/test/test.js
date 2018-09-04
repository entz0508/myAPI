// nodejs npm
const crypto      = require('crypto');

// common
const routeAuth   = require('../../common/util/route_middleware.js');
const message     = require('../../common/util/packet_sender.js');


// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const mysqlConnSlpPlatform = global.MYSQL_CONNECTOR_POOLS.slpPlatformConn;


//var common_util     = require('../../../common/util/common.js');
//var error_util = require('../../../common/util/error_code_util.js');


function add_routes(app) {
    "use strict";
    app.post('/slp.test', routeAuth.NO_AUTH_APP, function(req, res){

        var resObj = {};
        resObj.msg = "aaa";
        mysqlConnSlpPlatform.procTest(function(){

        });
        PRINT_LOG.info(__filename, "call slp.test");
        packetSender.sendJSONSuccess(req, res, resObj);
    });


    app.post('/slp.sha256', routeAuth.NO_AUTH_APP, function(req, res){
        var planText = req.plan_text;

        var resObj = {};
        resObj.hash = crypto.createHash("sha256").update("planText").digest("base64");
        packetSender.sendJSONSuccess(req, res, resObj);
    });
}

exports.add_routes = add_routes;