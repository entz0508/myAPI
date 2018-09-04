var mysql = require('mysql');

var PRINT_LOG = global.PRINT_LOGGER;

var pool  = mysql.createPool({
    connectionLimit : 3,
    host            : global.CONFIG.MYSQL_SLP_ACCOUNT.HOST,
    port            : global.CONFIG.MYSQL_SLP_ACCOUNT.PORT,
    user            : global.CONFIG.MYSQL_SLP_ACCOUNT.USER,
    password        : global.CONFIG.MYSQL_SLP_ACCOUNT.PASSWORD,
    database        : global.CONFIG.MYSQL_SLP_ACCOUNT.DATABASE
});

var isNull = function(value) {
    "use strict";
    if( (null === value)  || ("undefined" === typeof value) || ('' === value)  || (undefined === value) )  {
        return true;
    } else {
        return false;
    }
};

function MySQLConnectorForSlpAccount() {
    // Mysql connection keep alive check
    setInterval(function () {
        "use strinct";
        try {
            pool.getConnection(function(err, connection) {
                if (err) {
                    PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.setInterval, pool.getConnection", err);
                } else {
                    connection.query("SELECT 1", function (connErr, rows) {
                        //PRINT_LOG.info(__filename,"MySQLConnectorForSlpAccount, SELECT 1");
                        if (connErr) {
                            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.setInterval, pool.getConnection, connection.query", connErr);
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


MySQLConnectorForSlpAccount.prototype.procWatchdogPing = function(callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procWatchdogPing, ", err);
            callBack(err, null);
        } else {
            var queryStr = " SELECT 1 AS `RES` ";
            connection.query(queryStr, function (connErr, rows) {
                var isSuccess = false;
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.procWatchdogPing, db failed query:' + queryStr, connErr);
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


MySQLConnectorForSlpAccount.prototype.procUserAccountCreate = function(appID, clientUID, CLIENT_IP,
                                                                       accountEmail, accountPWD, accountCountry, signUpPath,
                                                                       profileName, profileBirthday, profileGender, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procCreateDeveloperAccount, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL spUserAccountCreate(  " + Number(appID) + ", " +
                                                            connection.escape(clientUID) + ", " +
                                                            connection.escape(CLIENT_IP) + ", " +
                                                            connection.escape(accountEmail) + ", " +
                                                            connection.escape(accountPWD) + ", " +
                                                            connection.escape(accountCountry) + ", " +
                                                            connection.escape(signUpPath) + ", " +
                                                            connection.escape(profileName) + ", " +
                                                            connection.escape(profileBirthday) + ", " +
                                                            connection.escape(profileGender) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.spUserAccountCreate, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};

MySQLConnectorForSlpAccount.prototype.procUserAccountLogin = function(appID, clientUID,clientIP, accountEmail, accountPWD, signUpPath, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procUserAccountLogin, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spUserAccountLogin(  " + Number(appID) + ", " +
                                                            connection.escape(clientUID) + ", " +
                                                            connection.escape(clientIP) + ", " +
                                                            connection.escape(accountEmail) + ", " +
                                                            connection.escape(accountPWD) + ", " +
                                                            connection.escape(signUpPath)  + " ) ";

            PRINT_LOG.info("","",queryStr);
            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.sp_user_account_login, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};


MySQLConnectorForSlpAccount.prototype.procIsLoginUserAccount = function(appID, clientUID, accountID, accessToken, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procUserAccountLogin, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL spIsLoginUserAccount(  " +  Number(appID) + ", " +
                                                                connection.escape(clientUID) + ", " +
                                                                Number(accountID) + ", " +
                                                                connection.escape(accessToken) + " ) ";


            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.spUserAccountLogin, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};

MySQLConnectorForSlpAccount.prototype.procIsLoginUserAccountWithProfileID = function(appID, clientUID, accountID, accessToken, profileID, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procUserAccountLogin, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL spIsLoginUserAccountWithProfileID(  " +  Number(appID) + ", " +
                                                                    connection.escape(clientUID) + ", " +
                                                                    Number(accountID) + ", " +
                                                                    connection.escape(accessToken) + ", " +
                                                                    Number(profileID) + " ) ";


            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.spUserAccountLogin, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};

MySQLConnectorForSlpAccount.prototype.procUserAccountAllowApp = function(appID,clientUID, accountID, accessToken, clientIP, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procUserAccountAllowApp, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL spUserAccountAllowApp(  " +  Number(appID) + ", " +
                                                                connection.escape(clientUID) + ", " +
                                                                Number(accountID) + ", " +
                                                                connection.escape(accessToken) + ", " +
                                                                connection.escape(clientIP) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.procUserAccountAllowApp, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};


MySQLConnectorForSlpAccount.prototype.procGetUserAccountSignupPath = function(appID, clientUID, accountEmail, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procGetUserAccountSignupPath, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spGetUserAccountSignupPath(  " + Number(appID) + "," +
                                                                    connection.escape(clientUID) + ", " +
                                                                    connection.escape(accountEmail) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.spGetUserAccountSignupPath, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};

MySQLConnectorForSlpAccount.prototype.procProfileAdd = function(appID, clientUID, accountID, accessToken,
                                                                profileName, profileBirthday, profileGender, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procProfileAdd, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL spProfileAdd(  " + Number(appID) + ", " +
                                                    connection.escape(clientUID) + ", " +
                                                    Number(accountID) + ", " +
                                                    connection.escape(accessToken) + ", " +
                                                    connection.escape(profileName) + ", " +
                                                    connection.escape(profileBirthday) + ", " +
                                                    connection.escape(profileGender) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.spProfileAdd, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};

MySQLConnectorForSlpAccount.prototype.procProfileEdit = function(requestPrams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procProfileEdit, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL spProfileEdit(  " + Number(requestPrams.appID) + ", " +
                                                connection.escape(requestPrams.clientUID) + ", " +
                                                Number(requestPrams.accountID) + ", " +
                                                connection.escape(requestPrams.accessToken) + ", " +
                                                Number(requestPrams.profileID) + ", " +
                                                connection.escape(requestPrams.profileName) + ", " +
                                                connection.escape(requestPrams.profileBirthday) + ", " +
                                                connection.escape(requestPrams.profileGender) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.spProfileEdit, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};

MySQLConnectorForSlpAccount.prototype.procProfileEditLimitTime = function(requestPrams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procProfileEditLimitTime, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL sp_profile_edit_limittime(  " + Number(requestPrams.appID) + ", " +
                                                    connection.escape(requestPrams.clientUID) + ", " +
                                                    Number(requestPrams.accountID) + ", " +
                                                    connection.escape(requestPrams.accessToken) + ", " +
                                                    Number(requestPrams.profileID) + ", " +
                                                    Number(requestPrams.limitTime) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.sp_profile_edit_limittime, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};


MySQLConnectorForSlpAccount.prototype.procForgotUserAccountPasswordChange = function(appID, clientUID, accountEmail, accountPWD, chtoken, clientIP, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procForgotUserAccountPasswordChange, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL spForgotUserAccountPasswordChange(  " + Number(appID) + ", " +
                                                                            connection.escape(clientUID) + ", " +
                                                                            connection.escape(clientIP) + ", " +
                                                                            connection.escape(accountEmail) + ", " +
                                                                            connection.escape(accountPWD) + ", " +
                                                                            connection.escape(chtoken) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.procForgotUserAccountPasswordChange, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};

MySQLConnectorForSlpAccount.prototype.procForgotUserAccountPasswordToken = function(appID, clientUID, clientIP, accountEmail, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procForgotUserAccountPasswordToken, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL spForgotUserAccountPasswordToken(  " + Number(appID) + ", " +
                                                                        connection.escape(clientUID) + ", " +
                                                                        connection.escape(clientIP) + ", " +
                                                                        connection.escape(accountEmail) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procForgotUserAccountPasswordToken, db failed query:" + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};

MySQLConnectorForSlpAccount.prototype.procProfileDelete = function(appID, clientUID, clientIP, accountID, accessToken,profileID, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procProfileDelete, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL spProfileDelete(  " + Number(appID) + ", " +
                                                        connection.escape(clientUID) + ", " +
                                                        connection.escape(clientIP) + ", " +
                                                        Number(accountID) + ", " +
                                                        connection.escape(accessToken) + ", " +
                                                        Number(profileID) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.spProfileDelete, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};


MySQLConnectorForSlpAccount.prototype.procGetUserAccountWithProfileInfo = function(appID, clientUID, clientIP, accountID, accessToken, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procGetUserAccountWithProfileInfo, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spGetUserAccountWithProfileInfo(  " + Number(appID) + ", " +
                                                                        connection.escape(clientUID) + ", " +
                                                                        connection.escape(clientIP) + ", " +
                                                                        Number(accountID) + ", " +
                                                                        connection.escape(accessToken) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.spGetUserAccountWithProfileInfo, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};


MySQLConnectorForSlpAccount.prototype.procIsAllowAPP = function(appID, clientUID, clientIP, accountID, accessToken, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procIsAllowAPP, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spIsAllowAPP(  " + Number(appID) + ", " +
                                                    connection.escape(clientUID) + ", " +
                                                    connection.escape(clientIP) + ", " +
                                                    Number(accountID) + ", " +
                                                    connection.escape(accessToken) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.spIsAllowAPP, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};

MySQLConnectorForSlpAccount.prototype.procUpdateProfileIMG = function(requestParams, serverIdx, imageDefaultFileName, imageThumbnailFileName, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpDla.procAddPhotos, ", err);
            callBack(err, null);
        } else {
            var queryStr = " CALL spProfileImgUpdate( " + Number(requestParams.appID) + ", " +
                                                        connection.escape(requestParams.os)  + ", " +
                                                        connection.escape(requestParams.clientUID)  + ", " +
                                                        Number(requestParams.accountID) + ", " +
                                                        connection.escape(requestParams.accessToken)  + ", " +
                                                        Number(requestParams.profileID)  + ", " +
                                                        Number(serverIdx)  + ", " +
                                                        connection.escape(imageDefaultFileName) + ", " +
                                                        connection.escape(imageThumbnailFileName) + ", " +
                                                        Number(requestParams.curUnixtime) + ") ";


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




MySQLConnectorForSlpAccount.prototype.procAccountSecession = function(requestPrams, callBack) {
    "use strict";
    pool.getConnection(function(err, connection){
        if(err) {
            PRINT_LOG.setErrorLog("MySQLConnectorForSlpAccount.procAccountSecession, ", err);
            callBack(err, null);
        } else {

            var queryStr = " CALL sp_user_account_secession(  " + Number(requestPrams.appID) + ", " +
                                                            connection.escape(requestPrams.clientUID) + ", " +
                                                            Number(requestPrams.accountID) + ", " +
                                                            connection.escape(requestPrams.accessToken) + ", " +
                                                            Number(requestPrams.curUnixtime) + " ) ";

            connection.query(queryStr, function (connErr, rows) {
                if (connErr) {
                    PRINT_LOG.setErrorLog('MySQLConnectorForSlpAccount.sp_user_account_secession, db failed query:' + queryStr, connErr);
                }
                callBack(connErr, rows);
                connection.release();
            });
        }
    });
};


module.exports = MySQLConnectorForSlpAccount;