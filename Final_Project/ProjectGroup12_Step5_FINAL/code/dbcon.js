var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_sinclala',
  password        : '',
  database        : 'cs340_sinclala'
});
module.exports.pool = pool;
