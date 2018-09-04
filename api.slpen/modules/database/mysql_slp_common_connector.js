var mysql = require('mysql');
var pool = mysql.createPool({
	host: global.CONFIG.MYSQL_SLP_COMMON.HOST,
	port: global.CONFIG.MYSQL_SLP_COMMON.PORT,
	user: global.CONFIG.MYSQL_SLP_COMMON.USER,
	password: global.CONFIG.MYSQL_SLP_COMMON.PASSWORD,
	database: global.CONFIG.MYSQL_SLP_COMMON.DATABASE,
	connectionLimit: global.CONFIG.MYSQL_SLP_COMMON.CONNECTION_LIMIT
});

module.exports = function(checkConnect, runQS) {
	function MYSQL_SLP_COMMON_CONN() {
		checkConnect(pool, "MYSQL_SLP_COMMON_CONN.setInterval, pool.getConnection");
	}
	
	
	MYSQL_SLP_COMMON_CONN.prototype.procWatchdogPing = function(callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			connection.query(" SELECT 1 AS `RES` ", function(connErr) {
				connection.release();
				callBack(connErr, !connErr);
			});
		});
	};
	
	MYSQL_SLP_COMMON_CONN.prototype.procGetEpisodePermList = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_episode_perm_list(  " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.accountID) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_COMMON_CONN.prototype.procGetLevelPermList = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL spGetLevelPermList(  " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.accountID) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};

	MYSQL_SLP_COMMON_CONN.prototype.procBuyProduct = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL spBuyProduct(  " + connection.escape(requestParams.productID) + ", " +
				Number(requestParams.appID) + ", " +
				Number(requestParams.accountID) + ", " +
				connection.escape(requestParams.payMethod) + ", " +
				connection.escape(requestParams.receipt) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.goodsID) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_COMMON_CONN.prototype.procGetEpisodeList = function(appID, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL spGetEpisodeList(" + Number(appID) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_COMMON_CONN.prototype.procGetProductPerm = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL spGetProductPermList(  " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.accountID) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_COMMON_CONN.prototype.procSetSubscribeFalse = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL spSetSubscribeFalse(  " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.accountID) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_COMMON_CONN.prototype.procQuestRequestList = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL spQuestRequestList(  " + Number(requestParams.accountID) + ", " +
				Number(requestParams.appID) + ", " +
				connection.escape(requestParams.questAppID) + ", " +
				connection.escape(requestParams.questClass) + ", " +
				connection.escape(requestParams.questId) + ", " +
				connection.escape(requestParams.questDuplicateUnit) + ", " +
				connection.escape(requestParams.questStarpoint) + ", " +
				connection.escape(requestParams.timeZone) + ", " +
				Number(requestParams.questCount) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	
	MYSQL_SLP_COMMON_CONN.prototype.procQuestRequest = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL spQuestRequest(  " + Number(requestParams.accountID) + ", " +
				Number(requestParams.appID) + ", " +
				connection.escape(requestParams.questAppID) + ", " +
				Number(requestParams.profileID) + ", " +
				connection.escape(requestParams.questClass) + ", " +
				connection.escape(requestParams.questID) + ", " +
				connection.escape(requestParams.questDuplicateUnit) + ", " +
				Number(requestParams.questStarpoint) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.questDesc) + ", " +
				connection.escape(requestParams.questClasses) + ", " +
				connection.escape(requestParams.questIds) + ", " +
				connection.escape(requestParams.questDuplicateUnits) + ", " +
				connection.escape(requestParams.timeZone) + ", " +
				Number(requestParams.questCount) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	return MYSQL_SLP_COMMON_CONN;
};