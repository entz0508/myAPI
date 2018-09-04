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

// mysql
const MYSQL_SLP_PLATFORM_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_PLATFORM;
const MYSQL_SLP_ACCOUNT_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_ACCOUNT;



function add_routes(app) {
    "use strict";

    var sendMailForgotPassword = function( toEmailAddr , newPwd, lang ) {
        var mail = new NODE_MAILER();
        mail.init();

        var subject = "";
        if("kr" === lang) {
            subject = "SLP 임시 비밀번호 안내 메일";
        }
        else {
            subject = "SLP 임시 비밀번호 안내 메일";
        }

        var to = toEmailAddr;
        var fs = require("fs");
        var html = fs.readFileSync('./public/mailForm/slp_forgot_password.html', 'utf8');
        html = html.replace(/\[CODE\]/g, newPwd);

        mail.send(to, subject, html, lang, function(error, success){
            if(error) {
                PRINT_LOG.setErrorLog( "[" + __filename + "] send Mail ForgotPassword, Failed ", error );
            }
        });
    };

    app.post("/slp.user.account.forgot.password.change", ROUTE_MIDDLEWARE.AUTH_APP, function(req, res){
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientIdentifier = COMMON_UTIL.trim(req.body.client_uid);
            var chtokken =COMMON_UTIL.trim(req.body.ch_token);

            var accountEmail = COMMON_UTIL.trim(req.body.email);
            if( !COMMON_UTIL.isEmail(accountEmail)  ) {
                PRINT_LOG.error(__filename, API_PATH, " error parameter accountEmail");
            } else {
                var pwd = COMMON_UTIL.makePassword(10, false);
                var accountPWD = CRYPTO.createHash("sha512").update(pwd).digest("base64");
                MYSQL_SLP_ACCOUNT_CONN.procForgotUserAccountPasswordChange(appID, accountEmail, accountPWD, chtokken, clientIdentifier, CLIENT_IP,
                    function (err, results) {
                        if (err) {
                            PRINT_LOG.error(__filename, API_PATH, " procUserAccountLogin, faile db, error");
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                        } else {
                            var retV = COMMON_UTIL.getMysqlRES(results);
                            if( ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                                PRINT_LOG.error(__filename, API_PATH, retV.msg);
                                PACKET.sendFail(req, res, retV.res);
                            }   else {
                                var row = results[0][0];
                                var responseObj = {};
                                responseObj.email = row.EMAIL;
                                PACKET.sendSuccess(req, res, responseObj);
                            }
                        }
                    });
            }
        } catch(catchErr) {
            var msg = "[" + API_PATH + "] error, [" + __filename + "]";
            PRINT_LOG.setErrorLog(msg, catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
}

exports.add_routes = add_routes;