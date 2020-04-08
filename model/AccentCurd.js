const pool = require('../dbunit/operate');
const userCheckSql = `SELECT * FROM accents WHERE accent=? and password=?`;
module.exports = {
  CheckAccent(param) {
    let promise = new Promise(function (resolve, reject) {
      pool.query(userCheckSql, [param.accent, param.password], function (
        err,
        results,
        fields
      ) {
        resolve({
          err: err,
          results: results,
          fields: fields,
        });
        reject({
          err: err,
        });
      });
    });
    return promise;
  },
};
