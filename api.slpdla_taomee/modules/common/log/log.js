// log 관련 세팅
var log4js = require('log4js');

function Logger() {
}

Logger.prototype.logger = null;

Logger.prototype.log_init = function(appender) {
	log4js.configure({ appenders: appender });
	this.logger = log4js.getLogger(global.CONFIG.LOG_INFO.CATEGORY);
	this.logger.setLevel(global.CONFIG.LOG_INFO.LOGGER_LEVEL);
};

Logger.prototype.setErrorLog = function setErrorLog(title, err) {
	this.logger.error('\n==============================================================');
	this.logger.error('[' + title + '] error');
	this.logger.error('--------------------------------------------------------------');
	this.logger.error('[Stack]' + err.stack);
	this.logger.error('[Arguments]' + err.arguments);
	this.logger.error('[Type]' + err.type);
	this.logger.error('[Message]' + err.message);
	this.logger.error('==============================================================\n');
};

Logger.prototype.error = function error(fileName, apiPath, message) {
	this.logger.error(apiPath + ", " + message + " \t\t [" + fileName + "] ");
};

Logger.prototype.info = function info(fileName, apiPath, message) {
	this.logger.info(apiPath + ", " + message + " \t\t [" + fileName + "] ");
};

module.exports = Logger;