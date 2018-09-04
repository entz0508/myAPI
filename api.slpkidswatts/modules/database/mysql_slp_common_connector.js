var mysql = require('mysql');

var PRINT_LOG = global.PRINT_LOGGER;

var pool  = mysql.createPool({
    connectionLimit : global.CONFIG.MYSQL_SLP_COMMON.CONNECTION_LIMIT,
    host            : global.CONFIG.MYSQL_SLP_COMMON.HOST,
    port            : global.CONFIG.MYSQL_SLP_COMMON.PORT,
    user            : global.CONFIG.MYSQL_SLP_COMMON.USER,
    password        : global.CONFIG.MYSQL_SLP_COMMON.PASSWORD,
    database        : global.CONFIG.MYSQL_SLP_COMMON.DATABASE
});



var isNull = function(value) {
    "use strict";
    if( (null === value)  || ("undefined" === typeof value) || ('' === value)  || (undefined === value) )  {
        return true;
    } else {
        return false;
    }
};

function MySQLConnectorForSlpCommon() {
    // Mysql connection keep alive check
    setInterval(function () {
        "use strinct";
        try {
            pool.getConnection(function(err, connection) {
                if (err) {
                    PRINT_LOG.setErrorLog("MySQLConnectorForSlpCommon.setInterval, pool.getConnection", err);
                } else {
                    connection.query("SELECT 1", function (connErr, rows) {
                        //PRINT_LOG.info(__filename,"MySQLConnectorForSlpAccount, SELECT 1");
                        if (connErr) {
                            PRINT_LOG.setErrorLog("MySQLConnectorForSlpCommon.setInterval, pool.getConnection, connection.query", connErr);
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


MySQLConnectorForSlpCommon.prototype.procWatchdogPing = function(callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpCommon.procWatchdogPing, ", err);
            callBack(err, null);
        } else {
            var queryStr = " SELECT 1 AS `RES` ";
            connection.query(queryStr, function (connErr, rows) {
                var isSuccess = false;
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpCommon.procWatchdogPing, db failed query:' + queryStr, connErr);
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

MySQLConnectorForSlpCommon.prototype.procGetEpisodePermList = function( requestParams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpCommon.procGetEpisodePermList, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL sp_get_episode_perm_list(  " + Number(requestParams.appID) + ", " +
                                                                connection.escape(requestParams.os) + ", " +
                                                                connection.escape(requestParams.accountID) + ") ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog("MySQLConnectorForSlpCommon.sp_get_episode_perm_list, db failed query:" + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

module.exports = MySQLConnectorForSlpCommon;