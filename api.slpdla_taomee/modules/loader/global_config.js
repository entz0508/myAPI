const fs = require('fs');
const path = require('path');

const CRYPTO_UTIL = require('../common/util/aes_crypto.js');

global.DEV_LOCAL_SHOP = true;

global.GLOBAL_VARIABLE = require('./global_variable.js');

// config
var configString = "";

var isConfigEncryt = false;
if(isConfigEncryt) {
    var configData = fs.readFileSync('./config/config', 'utf8');
    configString = CRYPTO_UTIL.AESDecrypt(configData);
} else {
    configString = fs.readFileSync("./config/config.json", "utf8");
}
global.CONFIG = JSON.parse(configString);