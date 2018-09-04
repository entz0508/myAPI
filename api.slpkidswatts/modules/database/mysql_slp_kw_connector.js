var mysql = require('mysql');
var pool = mysql.createPool({
	host: global.CONFIG.MYSQL_SLP_KW.HOST,
	port: global.CONFIG.MYSQL_SLP_KW.PORT,
	user: global.CONFIG.MYSQL_SLP_KW.USER,
	password: global.CONFIG.MYSQL_SLP_KW.PASSWORD,
	database: global.CONFIG.MYSQL_SLP_KW.DATABASE,
	connectionLimit: global.CONFIG.MYSQL_SLP_KW.CONNECTION_LIMIT
});

module.exports = function(checkConnect, runQS) {
	function MYSQL_SLP_KW_CONN() {
		checkConnect(pool, "MYSQL_SLP_KW_CONN.setInterval, pool.getConnection");
	}
	
	MYSQL_SLP_KW_CONN.prototype.procWatchdogPing = function(callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			connection.query(" SELECT 1 AS `RES` ", function(connErr) {
				connection.release();
				callBack(connErr, !connErr);
			});
		});
	};
	
	MYSQL_SLP_KW_CONN.prototype.procRegDeviceToken = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_reg_device_token( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				connection.escape(requestParams.accessToken) + ", " +
				connection.escape(requestParams.deviceToken) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	return MYSQL_SLP_KW_CONN;
};