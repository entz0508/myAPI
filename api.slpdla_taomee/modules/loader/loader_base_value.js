
const fs = require('fs');

var baseValue = fs.readFileSync('./data/base_value.json', 'utf8');
global.BASE_VALUE = JSON.parse(baseValue);

