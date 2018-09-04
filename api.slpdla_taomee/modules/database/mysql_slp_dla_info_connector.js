var mysql = require('mysql');

var PRINT_LOG = global.PRINT_LOGGER;

var pool  = mysql.createPool({
    connectionLimit : global.CONFIG.MYSQL_SLP_DLA_INFO.CONNECTION_LIMIT,
    host            : global.CONFIG.MYSQL_SLP_DLA_INFO.HOST,
    port            : global.CONFIG.MYSQL_SLP_DLA_INFO.PORT,
    user            : global.CONFIG.MYSQL_SLP_DLA_INFO.USER,
    password        : global.CONFIG.MYSQL_SLP_DLA_INFO.PASSWORD,
    database        : global.CONFIG.MYSQL_SLP_DLA_INFO.DATABASE
});



var isNull = function(value) {
    "use strict";
    if( (null === value)  || ("undefined" === typeof value) || ('' === value)  || (undefined === value) )  {
        return true;
    } else {
        return false;
    }
};

function MySQLConnectorForSlpDlaInfo() {
    // Mysql connection keep alive check
    setInterval(function () {
        "use strinct";
        try {
            pool.getConnection(function(err, connection) {
                if (err) {
                    PRINT_LOG.setErrorLog("MySQLConnectorForSlpDlaInfo.setInterval, pool.getConnection", err);
                } else {
                    connection.query("SELECT 1", function (connErr, rows) {
                        //PRINT_LOG.info(__filename,"MySQLConnectorForSlpDlaInfo, SELECT 1");
                        if (connErr) {
                            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDlaInfo.setInterval, pool.getConnection, connection.query", connErr);
                            connection.end();
                        } else {
                            connection.release();
                        }
                    });
                }
            });
        } catch (err) {
            PRINT_LOG.setErrorLog("dora_account_query.setInterval catch", err);
        }
    }.bind(this), 1000 * 10);
}


MySQLConnectorForSlpDlaInfo.prototype.procWatchdogPing = function(callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDlaInfo.procWatchdogPing, ", err);
            callBack(err, null);
        } else {
            var queryStr = " SELECT 1 AS `RES` ";
            connection.query(queryStr, function (connErr, rows) {
                var isSuccess = false;
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDlaInfo.procWatchdogPing, db failed query:' + queryStr, connErr);
                    isSuccess = false;
                } else {
                    isSuccess = true;
                }
                connection.release();
                callBack(connErr, isSuccess);
            });
        }
    });
};

MySQLConnectorForSlpDlaInfo.prototype.procGetAppRes = function( requestParams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDlaInfo.procGetAppRes, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spGetAppRes(  " + Number(requestParams.appID) + ", " +
                                                    connection.escape(requestParams.os) + ", " +
                                                    connection.escape(requestParams.clientVer) + ") ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog("MySQLConnectorForSlpDlaInfo.procGetAppRes, db failed query:" + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

MySQLConnectorForSlpDlaInfo.prototype.procGetAppVersion = function( requestParams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDlaInfo.procGetAppVersion, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spGetAppVersion(  " + Number(requestParams.appID) + ", " +
                                                        connection.escape(requestParams.os) + ", " +
                                                        connection.escape(requestParams.clientVer) + ") ";



            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog("MySQLConnectorForSlpDlaInfo.procGetAppVersion, db failed query:" + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

/*
MySQLConnectorForSlpDlaInfo.prototype.procCreateDeveloperAccount = function(email, pwd, companyName, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDlaInfo.procCreateDeveloperAccount, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL spCreateDeveloperAccount(  " + connection.escape(email) + ", " + connection.escape(pwd) + ", " + connection.escape(companyName) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDlaInfo.procCreateDeveloperAccount, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

MySQLConnectorForSlpDlaInfo.prototype.procAuthApp = function(appID, apiKey, clientIP, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDlaInfo.procAuthApp, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spAuthApp(  " + connection.escape(appID) + ", " + connection.escape(apiKey) + ", " + connection.escape(clientIP) + " ) ";
            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDlaInfo.procAuthApp, CALL spAuthApp, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

MySQLConnectorForSlpDlaInfo.prototype.procAuthAppID = function(appID, authToken, clientIP, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDlaInfo.procAuthAppID, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spAuthAppID(  " + Number(appID) + ", " +
                                                        connection.escape(authToken) + ", " +
                                                        connection.escape(clientIP) + " ) ";
            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDlaInfo.procAuthAppID, CALL spAuthAppID, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};
*/

module.exports = MySQLConnectorForSlpDlaInfo;