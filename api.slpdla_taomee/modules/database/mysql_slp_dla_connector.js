var mysql = require('mysql');

var PRINT_LOG = global.PRINT_LOGGER;

var pool  = mysql.createPool({
    connectionLimit : global.CONFIG.MYSQL_SLP_DLA.CONNECTION_LIMIT,
    host            : global.CONFIG.MYSQL_SLP_DLA.HOST,
    port            : global.CONFIG.MYSQL_SLP_DLA.PORT,
    user            : global.CONFIG.MYSQL_SLP_DLA.USER,
    password        : global.CONFIG.MYSQL_SLP_DLA.PASSWORD,
    database        : global.CONFIG.MYSQL_SLP_DLA.DATABASE
});

var isNull = function(value) {
    "use strict";
    if( (null === value)  || ("undefined" === typeof value) || ('' === value)  || (undefined === value) )  {
        return true;
    } else {
        return false;
    }
};

function MySQLConnectorForSlpDla() {
    // Mysql connection keep alive check
    setInterval(function () {
        "use strinct";
        try {
            pool.getConnection(function(err, connection) {
                if (err) {
                    PRINT_LOG.setErrorLog("MySQLConnectorForSlpDla.setInterval, pool.getConnection", err);
                } else {
                    connection.query("SELECT 1", function (connErr, rows) {
                        //PRINT_LOG.info(__filename,"MySQLConnectorForSlpDla, SELECT 1");
                        if (connErr) {
                            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDla.setInterval, pool.getConnection, connection.query", connErr);
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


MySQLConnectorForSlpDla.prototype.procWatchdogPing = function(callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDla.procWatchdogPing, ", err);
            callBack(err, null);
        } else {
            var queryStr = " SELECT 1 AS `RES` ";
            connection.query(queryStr, function (connErr, rows) {
                var isSuccess = false;
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDla.procWatchdogPing, db failed query:' + queryStr, connErr);
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

MySQLConnectorForSlpDla.prototype.procIsLoggedIn = function(appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDla.procIsLoggedIn, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spIsLoggedIn( " + Number(appID)  + ", " +
                                                connection.escape(os)  + ", " +
                                                 connection.escape(clientUID)  + ", " +
                                                 Number(slpAccountID) + " , " +
                                                 connection.escape(slpAccountAccessToken) + " ) ";


            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDla.procIsLoggedIn, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

MySQLConnectorForSlpDla.prototype.procGetEpisodeList = function(requestParams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDla.spGetEpisodeList, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spGetEpisodeList( " + Number(requestParams.appID) + ", " +
                                                        connection.escape(requestParams.os)  + ", " +
                                                        connection.escape(requestParams.clientUID)  + ", " +
                                                        Number(requestParams.slpAccountID) + ", " +
                                                        connection.escape(requestParams.slpAccountAccessToken) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDla.spGetEpisodeList, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};



MySQLConnectorForSlpDla.prototype.procShopGetGooglePayload = function(requestParams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDla.procShopGetGooglePayload, ", err);
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
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDla.procShopGetGooglePayload, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};


MySQLConnectorForSlpDla.prototype.procShopGoogleConsume = function(requestParams, payload, orderID, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDla.procShopGoogleConsume, ", err);
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
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDla.spShopGoogleConsume, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

MySQLConnectorForSlpDla.prototype.procShopAppleConsume = function(requestParams, payload, orderID, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDla.procShopAppleConsume, ", err);
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
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDla.spShopGoogleConsume, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};

MySQLConnectorForSlpDla.prototype.procAddPhotos = function(requestParams, serverIdx, destPathIdx, imageDefaultFileName, imageThumbnailFileName, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDla.procAddPhotos, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spAddPhotos( " + Number(requestParams.appID) + ", " +
                                                    connection.escape(requestParams.os)  + ", " +
                                                    connection.escape(requestParams.clientUID)  + ", " +
                                                    Number(requestParams.slpAccountID) + ", " +
                                                    connection.escape(requestParams.slpAccountAccessToken)  + ", " +
                                                    Number(requestParams.profileID)  + ", " +
                                                    connection.escape(requestParams.episode_id)  + ", " +
                                                    Number(requestParams.curUnixtime) + ", " +
                                                    Number(serverIdx)  + ", " +
                                                    Number(destPathIdx) + ", " +
                                                    connection.escape(imageDefaultFileName) + ", " +
                                                    connection.escape(imageThumbnailFileName) + " ) ";


            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDla.spAddPhotos, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};


MySQLConnectorForSlpDla.prototype.procGetPhotosList = function(requestParams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDla.procGetPhotosList, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spGetPhotosList( " + Number(requestParams.appID) + ", " +
                                                        connection.escape(requestParams.os)  + ", " +
                                                        connection.escape(requestParams.clientUID)  + ", " +
                                                        Number(requestParams.slpAccountID) + ", " +
                                                        connection.escape(requestParams.slpAccountAccessToken)  + ", " +
                                                        Number(requestParams.profileID)  + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpDla.spGetPhotosList, db failed query:' + queryStr, connErr);
                }
                connection.release();
                callBack(connErr, rows);
            });
        }
    });
};


module.exports = MySQLConnectorForSlpDla;