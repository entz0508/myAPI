var mysql = require('mysql');
var pool = mysql.createPool({
	host: global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.HOST,
	port: global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.PORT,
	user: global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.USER,
	password: global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.PASSWORD,
	database: global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.DATABASE,
	connectionLimit: global.CONFIG.MYSQL_SLP_KW_ACTION_LOG.CONNECTION_LIMIT
});

module.exports = function(checkConnect, runQS) {
	function MYSQL_SLP_KW_ACTION_LOG_CONN() {
		checkConnect(pool, "MYSQL_SLP_KW_ACTION_LOG_CONN.setInterval, pool.getConnection");
	}
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procWatchdogPing = function(callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			connection.query(" SELECT 1 AS `RES` ", function(connErr) {
				connection.release();
				callBack(connErr, !connErr);
			});
		});
	};
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishTodayLearningForEnglish = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_todaylearning_for_english( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishTodayLearningForQuizGroup = function(requestParams, beginTS, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_todaylearning_for_quiz_group( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(beginTS) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishTodayLearningQuizList = function(requestParams, beginTS, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_todaylearning_for_quiz_list( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(beginTS) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishTodayLearningMedalList = function(requestParams, beginTS, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_todaylearning_for_medal_list( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(beginTS) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishLearningReportStepList = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_learning_report_for_steplist( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishLearningReportQuizList = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_learning_report_for_quizlist( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishLearningReportStepHomeschoolList = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_learning_report_for_homeschoollist( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procUpdateEnglishHomeschool = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_update_en_homeschool( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				connection.escape(requestParams.stepID) + ", " +
				connection.escape(requestParams.episodeID) + ", " +
				Number(requestParams.status) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishUsagestatisticsDayAverage = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_usagestatistics_day_average( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishUsagestatisticsTimezonePlayCount = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_usagestatistics_timezone_play_cnt( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishUsagestatisticsEpisodeLikeRank = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_episode_like_rank( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishMyMedalList = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_my_medal_list( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnglishLearningReportStepEpisodeList = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_learning_report_for_step_episode_list( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				Number(requestParams.profileID) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetTodayLearning = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_todaylearning( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.os) + ", " +
				connection.escape(requestParams.clientUID) + ", " +
				Number(requestParams.accountID) + " , " +
				connection.escape(requestParams.accessToken) + ", " +
				Number(requestParams.profileID) + ", " +
				Number(requestParams.curUnixtimeStamp) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnEpisodeClearList = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_episode_complete_play( " + Number(requestParams.appID) + ", " +
				connection.escape(requestParams.timeZone) + ", " +
				Number(requestParams.profileID) + " ) ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnUsagestatisticsPlayTime = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_usagestatistics_play_time( " + Number(requestParams.appID) + ", " +
				Number(requestParams.profileID) + ", " +
				connection.escape(requestParams.timeZone) + ", " +
				connection.escape(requestParams.startDate) + ", " +
				connection.escape(requestParams.endDate) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	
	MYSQL_SLP_KW_ACTION_LOG_CONN.prototype.procGetReportEnPlayRank = function(requestParams, callBack) {
		pool.getConnection(function(err, connection) {
			if (err) return callBack(err);
			var queryStr = " CALL sp_get_report_en_play_rank( " + Number(requestParams.appID) + ", " +
				Number(requestParams.profileID) + ", " +
				connection.escape(requestParams.timeZone) + ", " +
				connection.escape(requestParams.startDate) + ", " +
				connection.escape(requestParams.endDate) + ") ";
			runQS(connection, queryStr, callBack);
		});
	};
	
	return MYSQL_SLP_KW_ACTION_LOG_CONN;
};