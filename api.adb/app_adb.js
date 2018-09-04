// npm mudules
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var util = require("util");
var multipart = require("connect-multiparty");
// var methodOverride = require("method-override");

global.j_log = function() {
	console.log(process.pid);
	for (var i = 0; i < arguments.length; i++) console.log(arguments[i]);
	console.log(process.pid);
};

// custom loaders
require("./modules/loader/loaders.js");

const PRINT_LOG = global.PRINT_LOGGER;

var app = exports.app = express();

// view engine setup
app.set('port', global.CONFIG.SERVER_INFO.PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.enable('trust proxy');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
//app.use(methodOverride());
app.use(multipart());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', function(err) {
	util.log('==============================================================');
	util.log("[" + global.CONFIG.LOG_INFO.CATEGORY + "] uncaughtException");
	util.log('--------------------------------------------------------------');
	util.log('[Stack]\n' + err.stack);
	util.log('[Arguments] ' + err.arguments);
	util.log('[Type] ' + err.type);
	util.log('[Message] ' + err.message);
	util.log('==============================================================\n');
	PRINT_LOG.logger.error('\n==============================================================\n[uncaughtException2]\n--------------------------------------------------------------\n[Stack]\n' + err.stack + '\n[Arguments] : ' + err.arguments + '\n[Type] : ' + err.type + '\n[Message] : ' + err.message + '\n==============================================================\n');
	//process.exit(1);
});


app.get('/', function(req, res) {
	res.send(global.CONFIG.LOG_INFO.CATEGORY);
});

app.get('/favicon.ico', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'image/x-icon' });
	res.end();
});

// Router
require("./modules/routes/ext/is_logged_in_account.js").add_routes(app);

require("./modules/routes/account/userCreate.js").add_routes(app);
require("./modules/routes/bible/bibleEdit.js").add_routes(app);
require("./modules/routes/news/newsMain.js").add_routes(app);
require("./modules/routes/mypage/myPage.js").add_routes(app);
require("./modules/routes/mypage/myPhoto.js").add_routes(app);
require("./modules/routes/etc/etcUtil.js").add_routes(app);


const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const platformName = require("os").platform();
if ("win32" === platformName) {
	app.listen(app.get("port"));
	PRINT_LOG.info(__filename, "listening on port " + app.get("port") + ", mode:" + app.settings.env + ", platformName:" + platformName + ", pid:" + process.pid);
} else {
	if (cluster.isMaster) {
        // Ŭ������ ��Ŀ ���μ��� ��ũ
        for (var i = 0; i < numCPUs; i++) cluster.fork();

        cluster.on('online', function (worker) {
            PRINT_LOG.info(__filename, '������ ��Ŀ�� ���̵� : ' + worker.process.pid);
        });

        cluster.on('exit', function (worker, code, signal) {
            PRINT_LOG.info(__filename, '���� ��Ŀ�� ���̵� : ' + worker.process.pid);
            PRINT_LOG.info(__filename, '���� ��Ŀ�� exit code : ' + code);
            PRINT_LOG.info(__filename, '���� ��Ŀ�� signal : ' + signal);
        });
	} else {
		app.listen(app.get("port"));
		PRINT_LOG.info(__filename, "listening on port " + app.get("port") + ", mode:" + app.settings.env + ", platformName:" + platformName + ", pid:" + process.pid);
	}
}

function getPingFn(DBName) {
	return function(connErr, isSuccess) {
		if (!isSuccess) {
			PRINT_LOG.error(__filename, "Failed, MySQL Connect, " + DBName);
			PRINT_LOG.error(__filename, "Process EXIT");
			return process.exit(1);
		}
		// PRINT_LOG.info(__filename, "Success, MySQL Connect, " + DBName);
	};
}

//global.MYSQL_CONNECTOR_POOLS.ADB_ACCOUNT.procWatchdogPing(getPingFn("ADB Account DB"));

module.exports = app;