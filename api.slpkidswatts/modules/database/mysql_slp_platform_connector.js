var mysql = require('mysql');

var PRINT_LOG = global.PRINT_LOGGER;

var pool  = mysql.createPool({
    connectionLimit : 3,
    host            : global.CONFIG.MYSQL_SLP_PLATFORM.HOST,
    port            : global.CONFIG.MYSQL_SLP_PLATFORM.PORT,
    user            : global.CONFIG.MYSQL_SLP_PLATFORM.USER,
    password        : global.CONFIG.MYSQL_SLP_PLATFORM.PASSWORD,
    database        : global.CONFIG.MYSQL_SLP_PLATFORM.DATABASE
});



var isNull = function(value) {
    "use strict";
    if( (null === value)  || ("undefined" === typeof value) || ('' === value)  || (undefined === value) )  {
        return true;
    } else {
        return false;
    }
};

function MySQLConnectorForSlpPlatform() {
    // Mysql connection keep alive check
    setInterval(function () {
        "use strinct";
        try {
            pool.getConnection(function(err, connection) {
                if (err) {
                    PRINT_LOG.setErrorLog("MySQLConnectorForSlpPlatform.setInterval, pool.getConnection", err);
                } else {
                    connection.query("SELECT 1", function (connErr, rows) {
                        //PRINT_LOG.info(__filename,"MySQLConnectorForSlpPlatform, SELECT 1");
                        if (connErr) {
                            PRINT_LOG.setErrorLog("MySQLConnectorForSlpPlatform.setInterval, pool.getConnection, connection.query", connErr);
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


MySQLConnectorForSlpPlatform.prototype.procWatchdogPing = function(callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpPlatform.procWatchdogPing, ", err);
            callBack(err, null);
        } else {
            var queryStr = " SELECT 1 AS `RES` ";
            connection.query(queryStr, function (connErr, rows) {
                var isSuccess = false;
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpPlatform.procWatchdogPing, db failed query:' + queryStr, connErr);
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


MySQLConnectorForSlpPlatform.prototype.procCreateDeveloperAccount = function(email, pwd, companyName, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpPlatform.procCreateDeveloperAccount, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL spCreateDeveloperAccount(  " + connection.escape(email) + ", " + connection.escape(pwd) + ", " + connection.escape(companyName) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpPlatform.procCreateDeveloperAccount, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

MySQLConnectorForSlpPlatform.prototype.procAuthApp = function(appID, apiKey, clientIP, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpPlatform.procAuthApp, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spAuthApp(  " + connection.escape(appID) + ", " + connection.escape(apiKey) + ", " + connection.escape(clientIP) + " ) ";
            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpPlatform.procAuthApp, CALL spAuthApp, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

MySQLConnectorForSlpPlatform.prototype.procAuthAppID = function(appID, authToken, clientIP, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpPlatform.procAuthAppID, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spAuthAppID(  " + Number(appID) + ", " +
                                                        connection.escape(authToken) + ", " +
                                                        connection.escape(clientIP) + " ) ";
            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpPlatform.procAuthAppID, CALL spAuthAppID, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

module.exports = MySQLConnectorForSlpPlatform;