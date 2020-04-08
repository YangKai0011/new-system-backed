//mysql连接池配置文件
const mysql = require('mysql');
const dbConfig = require('./config');
// 使用连接池，避免开太多的线程，提升性能
const pool = mysql.createPool(dbConfig);

//exports
module.exports = pool;
