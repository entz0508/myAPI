require('date-utils'); // Date.prototype ����

// nodejs npm
const crypto = require('crypto');

// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");
const PRINT_LOG = global.PRINT_LOGGER;
const MYSQL_SLP_EN_INFO_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_EN_INFO;

var request = require("request");
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var url = global.CONFIG.CDN_INFO.URI + "dea/data/dea_service_kr.xml";

exports.add_routes = function (app) {
    app.post("/sen/app/ver", ROUTE_MIDDLEWARE.DEFAULT, function (req, res) {
        var API_PATH = req.route.path;

        try {
            MYSQL_SLP_EN_INFO_CONN.procGetAppVersion({
                appID: COMMON_UTIL.trim(req.body.app_id),
                os: COMMON_UTIL.trim(req.body.os),
                clientVer: COMMON_UTIL.trim(req.body.c_ver)
            }, function (err, results) {
                if (err || COMMON_UTIL.isNull(results) || (0 >= results.length) || (0 >= results[0].length)) {
                    var errType = "";

                    if (err) errType += "[err]";
                    if (COMMON_UTIL.isNull(results)) errType += "COMMON_UTIL.isNull(results)";
                    if (0 >= results.length) errType += "[0 >= results.length]";
                    if (0 >= results[0].length) errType += "[0 >= results[0].length]";

                    return PACKET.sendJson(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, { msg: "Error, DB, Platform " + errType });
                }

                request({ uri: url, method: "GET" }, function (error, response, body) {
                    console.log('\nconsole.log(body);');
                    console.log(body);
                    console.log('console.log(body);\n');

                    parser.parseString(body, function (err, result) {
                        var key = 'ehfksmschlrhdmlrydbrdyddoq@#$395'; //replace with your key
                        var iv = 'BAEisTheBestTeam'; //replace with your IV
                        var cipher = crypto.createCipheriv('aes256', key, iv);
                        var crypted = cipher.update(body, 'utf8', 'base64');
                        crypted += cipher.final('base64');

                        console.log('\nconsole.log(result);');
                        console.log(result);
                        console.log('console.log(result);\n');

                        PACKET.sendSuccess(req, res, {
                            latest_ver: results[0][0].VER,
                            summit: "y" === results[0][0].SUMMIT ? 1 : 0,
                            force_update: "y" === results[0][0].FORCE_UPDATE ? 1 : 0,
                            cur_force_update: "y" === results[0][0].CUR_FORCE_UPDATE ? 1 : 0,
                            update_url: results[0][0].UPDATE_URL,
                            cs_email: results[0][0].CS_EMAIL,
                            info: crypted,
                            local_date: (new Date()).toFormat('YYYY-MM-DD HH24:MI:SS') // TODO ������ �ð�
                        });
                    });
                });
            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
};