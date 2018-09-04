// nodejs npm
const crypto      = require('crypto');

// common
const routeAuth   = require('../../common/util/route_middleware.js');
const PACKET     = require('../../common/util/packet_sender.js');
const COMMON_UTIL     = require('../../common/util/common.js');
const ERROR_CODE_UTIL     = require('../../common/util/error_code_util.js');

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const mysqlConnSlpPlatform = global.MYSQL_CONNECTOR_POOLS.SLP_PLATFORM;



function add_routes(app) {
    "use strict";


    app.post('/slp.developer.create.account', routeAuth.NO_AUTH_APP, function(req, res){
        var API_PATH = req.route.path;

        var email = COMMON_UTIL.trim(req.body.email);
        var pwd = COMMON_UTIL.trim(req.body.password);
        var companyName = COMMON_UTIL.trim(req.body.company_name);

        var enPWD = crypto.createHash("sha512").update(pwd).digest("base64");

        mysqlConnSlpPlatform.procCreateDeveloperAccount(email, enPWD, companyName, function(err, results){
            if(err) {
                PRINT_LOG.error( __filename, API_PATH, " procCreateDeveloperAccount, faile db, error");
            } else if( COMMON_UTIL.isNull(results) || (0>=results.length) || (0>=results[0].length) ) {
                PRINT_LOG.error( __filename, API_PATH, " procCreateDeveloperAccount, faile db, result is null");
            } else {

                var row = results[0][0];
                var resCode = Number(row.RES);
                if( 1 !== resCode) {
                    var code = row.CODE;
                    var msg  = row.MSG;
                    PRINT_LOG.error( __filename, apiPath, " procCreateDeveloperAccount, code:" + code + ", msg:" + msg);
                    PACKET.sendFail(req, res, code);

                } else {
                    var retvObj = {};
                    retvObj.developer_id = row.DEVELOPER_ID;
                    retvObj.email = row.EMAIL;
                    retvObj.companay_name = row.COMPANAY_NAME;
                    retvObj.reg_datetime = row.REG_DATETIME;
                    PACKET.sendSuccess(req, res, retvObj);
                }
            }
        });
    });
}

exports.add_routes = add_routes;