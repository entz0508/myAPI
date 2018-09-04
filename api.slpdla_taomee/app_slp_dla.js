// npm mudules
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var util = require("util");
var multipart = require("connect-multiparty");
var methodOverride = require("method-override");

// custom loaders
require("./modules/loader/loaders.js");

const MYSQL_SLP_DLA_INFO_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA_INFO;
const MYSQL_SLP_DLA_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_DLA;
const MYSQL_SLP_KW_ACTION_LOG_CONN = global.MYSQL_CONNECTOR_POOLS.SLP_KW_ACTION_LOG;
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
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



process.on('uncaughtException', function (err) {
    "use strict";
    util.log('==============================================================');
    util.log("[" + global.CONFIG.LOG_INFO.CATEGORY + "] uncaughtException");
    util.log('--------------------------------------------------------------');
    util.log('[Stack]\n'+err.stack);
    util.log('[Arguments] '+err.arguments);
    util.log('[Type] '+err.type);
    util.log('[Message] '+err.message);
    util.log('==============================================================\n');
    PRINT_LOG.logger.error('\n==============================================================\n[uncaughtException2]\n--------------------------------------------------------------\n[Stack]\n'+err.stack+'\n[Arguments] : '+err.arguments+'\n[Type] : '+err.type+'\n[Message] : '+err.message + '\n==============================================================\n');
    //process.exit(1);
});


app.get('/', function(req, res){
    "use strict";
    res.send(global.CONFIG.LOG_INFO.CATEGORY);
});

app.get('/favicon.ico', function(req, res) {
    "use strict";
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
});

// Router
require("./modules/routes/action_log/action_log.js").add_routes(app);
require("./modules/routes/action_log/action_ping.js").add_routes(app);

require("./modules/routes/episode/episode_list.js").add_routes(app);

require("./modules/routes/photo/photo_list.js").add_routes(app);
require("./modules/routes/photo/photo_upload.js").add_routes(app);

require("./modules/routes/etc/app_res.js").add_routes(app);
require("./modules/routes/etc/app_ver.js").add_routes(app);
require("./modules/routes/etc/watchdog_ping.js").add_routes(app);


const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const platformName = require("os").platform();
if( "win32" === platformName ) {
    app.listen(app.get("port"));
    PRINT_LOG.info(__filename, GLOBAL.CONFIG.SERVER_INFO.NAME + " listening on port " + app.get("port") + " in mode :  " + app.settings.env + ", platformName:" + platformName + ", pid: " + process.pid);
} else {
    if (cluster.isMaster) {
        // 클러스터 워커 프로세스 포크
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', function (worker, code, signal) {
            "use strict";
            PRINT_LOG.info(__filename, "[ worker ] " + worker.process.pid + " died");
        });
    } else {
        app.listen(app.get("port"));
        PRINT_LOG.info(__filename, GLOBAL.CONFIG.SERVER_INFO.NAME + " listening on port " + app.get("port") + " in mode :  " + app.settings.env + ", platformName:" + platformName + ", cluster : " + process.pid);
    }
}

/*
var routes = require("./routes/index');
app.use('/', routes);
var users = require("./routes/users');
app.use('/users', users);
*/




/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    "use strict";
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        "use strict";
        res.status(err.status || 500);
        res.render('error', {
            PACKET: err.PACKET,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    "use strict";
    res.status(err.status || 500);
    res.render('error', {
        PACKET: err.PACKET,
        error: {}
    });
});

*/

MYSQL_SLP_DLA_INFO_CONN.procWatchdogPing(function(connErr, isSuccess){
    "use strict";
    if(isSuccess) {
        PRINT_LOG.info(__filename, "", "Success, MySQL Connect, SLP DLA INFO DB");
    } else {
        PRINT_LOG.error(__filename, "Failed, MySQL Connect, SLP DLA INFO DB");
    }
});

MYSQL_SLP_DLA_CONN.procWatchdogPing(function(connErr, isSuccess){
    "use strict";
    if(isSuccess) {
        PRINT_LOG.info(__filename, "", "Success, MySQL Connect, SLP DLA DB");
    } else {
        PRINT_LOG.error(__filename, "", "Failed, MySQL Connect, SLP DLA DB");
    }
});


MYSQL_SLP_KW_ACTION_LOG_CONN.procWatchdogPing(function(connErr, isSuccess){
    "use strict";
    if(isSuccess) {
        PRINT_LOG.info(__filename, "", "Success, MySQL Connect, SLP KW Action Log DB");
    } else {
        PRINT_LOG.error(__filename, "", "Failed, MySQL Connect, SLP KW Action Log DB");
    }
});




PRINT_LOG.info(__filename, "Run", GLOBAL.CONFIG.SERVER_INFO.NAME);



module.exports = app;
