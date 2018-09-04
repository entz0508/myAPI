var mysql = require('mysql');
var pool = mysql.createPool({
	host: global.CONFIG.MYSQL_SLP_KW_INFO.HOST,
	port: global.CONFIG.MYSQL_SLP_KW_INFO.PORT,
	user: global.CONFIG.MYSQL_SLP_KW_INFO.USER,
	password: global.CONFIG.MYSQL_SLP_KW_INFO.PASSWORD,
	database: global.CONFIG.MYSQL_SLP_KW_INFO.DATABASE,
	connectionLimit: global.CONFIG.MYSQL_SLP_KW_INFO.CONNECTION_LIMIT
});

module.exports = function(checkConnect, runQS) {
	function MYSQL_SLP_KW_INFO_CONN() {
		checkConnect(pool, "MYSQL_SLP_KW_INFO_CONN.setInterval, pool.getConnection");
	}
	
	
	MYSQL_SLP_KW_INFO_CONN.prototype.procWatchdogPing = function(callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			connection.query(" SELECT 1 AS `RES` ", function(connErr) {
				connection.release();
				callBack(connErr, !connErr);
			});
		});
	};
	
	MYSQL_SLP_KW_INFO_CONN.prototype.procGetAppRes = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_app_res(  " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientVer) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_KW_INFO_CONN.prototype.procGetAppVersion = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_app_version(  " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientVer) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	return MYSQL_SLP_KW_INFO_CONN;
};