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

    var sendMailWelcome = function( toEmailAddr , lang ) {
        var mail = new NODE_MAILER();
        mail.init();

        var subject = '';
        if(lang === "KR") {
            subject = "SLP Welcome";
        }
        else {
            subject = "SLP Welcome";
        }

        var to = toEmailAddr;
        var fs = require("fs");
        var html = fs.readFileSync("./public/mailForm/slp_welcome.html", "utf8");
        html = html.replace("[USER_EMAIL]", toEmailAddr);


        mail.send(to, subject, html, lang, function(error, success){
            if(error) {
                PRINT_LOG.setErrorLog( "[" + __filename + "] send Mail sendMailWelcome, Failed ", error );
            }
        });
    };


    app.post("/slp.user.account.create", ROUTE_MIDDLEWARE.AUTH_APP, function(req, res){
        var API_PATH = req.route.path;
        try {
            var CLIENT_IP = COMMON_UTIL.getClientIP(req);

            var appID = COMMON_UTIL.trim(req.body.app_id);
            var appToken = COMMON_UTIL.trim(req.body.app_token);
            var clientIdentifier = ""; //COMMON_UTIL.trim(req.body.client_uid);

            var accountEmail = COMMON_UTIL.trim(req.body.email);
            var pwd = COMMON_UTIL.trim(req.body.password);
            var accountCountry = COMMON_UTIL.trim(req.body.country);
            var signUpPath = COMMON_UTIL.trim(req.body.signup_path);
            var profileName = "guest";//req.body.pf_name;
            var profileBirthday = "2015-01-01";//req.body.pf_birthday;
            var profileGender = "m";//req.body.pf_gender;

            if( !COMMON_UTIL.isNumber(appID) || !COMMON_UTIL.isEmail(accountEmail) ||
                !COMMON_UTIL.isValidPassword(pwd) || !COMMON_UTIL.isValidCountry(accountCountry) ||
                !COMMON_UTIL.isValidSignupPath(signUpPath) || !COMMON_UTIL.isValidProfileName(profileName) ||
                !COMMON_UTIL.isValidDate(profileBirthday) || !COMMON_UTIL.isValidGender(profileGender) ) {
                PRINT_LOG.error( __filename, API_PATH, " error parameter " + JSON.stringify(req.body) );
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
            } else {

                accountCountry = accountCountry.toUpperCase();

                var accountPWD = CRYPTO.createHash("sha512").update(pwd).digest("base64");
                MYSQL_SLP_ACCOUNT_CONN.procUserAccountCreate(appID, clientIdentifier, CLIENT_IP,
                                                            accountEmail, accountPWD, accountCountry, signUpPath,
                                                            profileName, profileBirthday, profileGender,
                    function (err, results) {
                        if (err) {
                            PRINT_LOG.error(__filename, API_PATH, " procUserAccountCreate, faile db, error");
                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                        } else {
                            var retV = COMMON_UTIL.getMysqlRES(results);
                            if( ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
                                PRINT_LOG.error( __filename, API_PATH, retV.msg);
                                PACKET.sendFail(req, res, retV.res);
                            } else {
                                var row = results[0][0];

                                var responseObj = {};
                                responseObj.account_id = row.ACCOUNT_ID;
                                responseObj.access_token = row.ACCESS_TOKEN;

                                PACKET.sendSuccess(req, res, responseObj);
                                sendMailWelcome(accountEmail, accountCountry);
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