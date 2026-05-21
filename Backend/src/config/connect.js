const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,      
  user: 'root',           
  password: '',           
  database: 'solo_flix',  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;