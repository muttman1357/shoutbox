var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'rmares',
  password: 'DaPuw3ub',
  database: 'test'
});

module.exports = connection;