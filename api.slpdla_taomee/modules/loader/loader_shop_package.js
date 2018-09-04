var fs = require('fs');

var LOG_PRINT = global.PRINT_LOGGER;

global.SHOP_PACKAGE_LIST = [];

var fileFullPath = "./data/shop_package_" + global.CONFIG.SERVER_INFO.LEVEL + ".xml";

var xmlString = fs.readFileSync(fileFullPath, "utf8");
var parseString = require('xml2js').parseString;

parseString(xmlString, function (errParse, result) {
    if(errParse) {
        LOG_PRINT.setErrorLog(", failed parse shop package xml, fileFullPath:" + fileFullPath, errParse);
    } else {
        var len = result.packages.package.length;
        for(var i=0; i<len; i++) {
            var obj = {};
            obj.PACKAGE_ID  = Number(result.packages.package[i].$.package_id);
            obj.STORE       = result.packages.package[i].$.store;
            obj.PRODUCT_ID  = result.packages.package[i].$.product_id;
            obj.LEVEL       = Number(result.packages.package[i].$.level);
            obj.STATE       = Number(result.packages.package[i].$.state);
            obj.TITLE       = result.packages.package[i].title[0];
            obj.PRICE       = result.packages.package[i].price[0];
            obj.CURRENCY    = result.packages.package[i].currency[0];
            obj.TICKET_TYPE    = result.packages.package[i].ticket_type[0];
            obj.QTY         = Number(result.packages.package[i].qty[0]);

            if( (0 !== obj.STATE) && (obj.LEVEL === global.CONFIG.SERVER_INFO.LEVEL) )  {
                global.SHOP_PACKAGE_LIST.push(obj);
            }

        }
    }
});