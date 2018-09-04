var mysql = require('mysql');

var PRINT_LOG = global.PRINT_LOGGER;

var pool  = mysql.createPool({
    connectionLimit : global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.CONNECTION_LIMIT,
    host            : global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.HOST,
    port            : global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.PORT,
    user            : global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.USER,
    password        : global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.PASSWORD,
    database        : global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.DATABASE
});

var isNull = function(value) {
    "use strict";
    if( (null === value)  || ("undefined" === typeof value) || ('' === value)  || (undefined === value) )  {
        return true;
    } else {
        return false;
    }
};

function MySQLConnectorForSlpKwActionLog() {
    // Mysql connection keep alive check
    setInterval(function () {
        "use strinct";
        try {
            pool.getConnection(function(err, connection) {
                if (err) {
                    PRINT_LOG.setErrorLog("MySQLConnectorForSlpKwActionLog.setInterval, pool.getConnection", err);
                } else {
                    connection.query("SELECT 1", function (connErr, rows) {
                        //PRINT_LOG.info(__filename,"MySQLConnectorForSlpKwActionLog, SELECT 1");
                        if (connErr) {
                            PRINT_LOG.setErrorLog("MySQLConnectorForSlpKwActionLog.setInterval, pool.getConnection, connection.query", connErr);
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


MySQLConnectorForSlpKwActionLog.prototype.procWatchdogPing = function(callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpKwActionLog.procWatchdogPing, ", err);
            callBack(err, null);
        } else {
            var queryStr = " SELECT 1 AS `RES` ";
            connection.query(queryStr, function (connErr, rows) {
                var isSuccess = false;
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpKwActionLog.procWatchdogPing, db failed query:' + queryStr, connErr);
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

MySQLConnectorForSlpKwActionLog.prototype.procAddActionLog = function(requestParams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpKwActionLog.procAddActionLog, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL sp_add_action_log( " + Number(requestParams.appID)  + ", " +
                                                        connection.escape(requestParams.os)  + ", " +
                                                        connection.escape(requestParams.clientUID)  + ", " +
                                                        Number(requestParams.accountID) + " , " +
                                                        connection.escape(requestParams.accessToken) + ", " +
                                                        Number(requestParams.profileID) + ", " +
                                                        connection.escape(requestParams.actionType) + ", " +
                                                        connection.escape(requestParams.episodeID) + ", " +
                                                        connection.escape(requestParams.chapter) + ", " +
                Number(requestParams.playTime) + ", " +
                Number(requestParams.curUnixtimeStamp) + " ) ";


                connection.query(queryStr, function (connErr, rows) {
                    if (connErr) {
                        PRINT_LOG.setErrorLog('MySQLConnectorForSlpKwActionLog.spAddActionLog, db failed query:' + queryStr, connErr);
                    }
                    connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

MySQLConnectorForSlpKwActionLog.prototype.procAddPingLog = function(requestParams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpKwActionLog.procAddPingLog, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL sp_add_ping_log( " + Number(requestParams.appID)  + ", " +
                                                        connection.escape(requestParams.os)  + ", " +
                                                        connection.escape(requestParams.clientUID)  + ", " +
                                                        Number(requestParams.accountID) + " , " +
                                                        connection.escape(requestParams.accessToken) + ", " +
                                                        Number(requestParams.profileID) + ", " +
                                                        connection.escape(requestParams.pingType) + ", " +
                                                        connection.escape(requestParams.p1) + ", " +
                                                        connection.escape(requestParams.p2) + ", " +
                                                        Number(requestParams.curUnixtimeStamp) + " ) ";


            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpKwActionLog.spAddPingLog, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};


/*
MySQLConnectorForSlpKwActionLog.prototype.procGetEpisodeList = function(requestParams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpKwActionLog.spGetEpisodeList, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spGetEpisodeList( " + Number(requestParams.appID) + ", " +
                                                        connection.escape(requestParams.os)  + ", " +
                                                        connection.escape(requestParams.clientUID)  + ", " +
                                                        Number(requestParams.slpAccountID) + ", " +
                                                        connection.escape(requestParams.slpAccountAccessToken) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpKwActionLog.spGetEpisodeList, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};



MySQLConnectorForSlpKwActionLog.prototype.procShopGetGooglePayload = function(requestParams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpKwActionLog.procShopGetGooglePayload, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spShopGetGooglePayload( " + Number(requestParams.appID) + ", " +
                                                                connection.escape(requestParams.os)  + ", " +
                                                                connection.escape(requestParams.clientUID)  + ", " +
                                                                Number(requestParams.userID) + ", " +
                                                                connection.escape(requestParams.userAccessToken)  + ", " +
                                                                Number(requestParams.slpAccountID) + ", " +
                                                                connection.escape(requestParams.slpAccountAccessToken)  + ", " +
                                                                connection.escape(requestParams.build)  + ", " +
                                                                connection.escape(requestParams.store)  + ", " +
                                                                Number(requestParams.packageID) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpKwActionLog.procShopGetGooglePayload, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};


MySQLConnectorForSlpKwActionLog.prototype.procShopGoogleConsume = function(requestParams, payload, orderID, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpKwActionLog.procShopGoogleConsume, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spShopGoogleConsume( " + Number(requestParams.appID) + ", " +
                                                                connection.escape(requestParams.os)  + ", " +
                                                                connection.escape(requestParams.clientUID)  + ", " +
                                                                Number(requestParams.userID) + ", " +
                                                                connection.escape(requestParams.userAccessToken)  + ", " +
                                                                Number(requestParams.slpAccountID) + ", " +
                                                                connection.escape(requestParams.slpAccountAccessToken)  + ", " +
                                                                connection.escape(requestParams.build)  + ", " +
                                                                connection.escape(requestParams.store)  + ", " +
                                                                Number(requestParams.packageID) + ", " +
                                                                connection.escape(payload) + ", " +
                                                                connection.escape(orderID) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpKwActionLog.spShopGoogleConsume, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

MySQLConnectorForSlpKwActionLog.prototype.procShopAppleConsume = function(requestParams, payload, orderID, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpKwActionLog.procShopAppleConsume, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spShopAppleConsume( " + Number(requestParams.appID) + ", " +
                                                        connection.escape(requestParams.os)  + ", " +
                                                        connection.escape(requestParams.clientUID)  + ", " +
                                                        Number(requestParams.userID) + ", " +
                                                        connection.escape(requestParams.userAccessToken)  + ", " +
                                                        Number(requestParams.slpAccountID) + ", " +
                                                        connection.escape(requestParams.slpAccountAccessToken)  + ", " +
                                                        connection.escape(requestParams.build)  + ", " +
                                                        connection.escape(requestParams.store)  + ", " +
                                                        Number(requestParams.packageID) + ", " +
                                                        connection.escape(payload) + ", " +
                                                        connection.escape(orderID) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpKwActionLog.spShopGoogleConsume, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

MySQLConnectorForSlpKwActionLog.prototype.procAddPhotos = function(requestParams, serverIdx, destPath, imageDefaultFileName, imageThumbnailFileName, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpKwActionLog.procAddPhotos, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spAddPhotos( " + Number(requestParams.appID) + ", " +
                                                    connection.escape(requestParams.os)  + ", " +
                                                    connection.escape(requestParams.clientUID)  + ", " +
                                                    Number(requestParams.userID) + ", " +
                                                    connection.escape(requestParams.userAccessToken)  + ", " +
                                                    Number(requestParams.slpAccountID) + ", " +
                                                    connection.escape(requestParams.slpAccountAccessToken)  + ", " +
                                                    Number(requestParams.profileID)  + ", " +
                                                    Number(requestParams.episode_id)  + ", " +
                                                    Number(requestParams.photoType)  + ", " +
                                                    Number(serverIdx)  + ", " +
                                                    connection.escape(destPath) + ", " +
                                                    connection.escape(imageDefaultFileName) + ", " +
                                                    connection.escape(imageThumbnailFileName) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpKwActionLog.spAddPhotos, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};


MySQLConnectorForSlpKwActionLog.prototype.procGetPhotosList = function(requestParams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpKwActionLog.procGetPhotosList, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spGetPhotosList( " + Number(requestParams.appID) + ", " +
                                                        connection.escape(requestParams.os)  + ", " +
                                                        connection.escape(requestParams.clientUID)  + ", " +
                                                        Number(requestParams.slpAccountID) + ", " +
                                                        connection.escape(requestParams.slpAccountAccessToken)  + ", " +
                                                        Number(requestParams.profileID)  + ", " +
                                                        Number(requestParams.photoType)  + ", " +
                                                        Number(requestParams.episode_id)  + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpKwActionLog.spGetPhotosList, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};
*/

module.exports = MySQLConnectorForSlpKwActionLog;