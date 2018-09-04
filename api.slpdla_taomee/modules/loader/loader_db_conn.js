
// DB Connector
global.MYSQL_CONNECTOR_POOLS = {};

var MySQLConnectorForSlpDlaInfo = require("../database/mysql_slp_dla_info_connector.js");
global.MYSQL_CONNECTOR_POOLS.SLP_DLA_INFO  = new MySQLConnectorForSlpDlaInfo();


var MySQLConnectorForSlpDla = require("../database/mysql_slp_dla_connector.js");
global.MYSQL_CONNECTOR_POOLS.SLP_DLA  = new MySQLConnectorForSlpDla();


var MySQLConnectorForSlpKwActionLog = require("../database/mysql_slp_kw_action_log_connector.js");
global.MYSQL_CONNECTOR_POOLS.SLP_KW_ACTION_LOG = new MySQLConnectorForSlpKwActionLog();