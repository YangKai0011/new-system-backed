const pool = require('../dbunit/operate');

function callback(resolve, reject) {
  return function (err, results, fields) {
    resolve({ err: err, results: results, fields: fields });
    reject({ err: err });
  }
}

module.exports = {

    //插入宿舍评比信息
    insertApprisal(paramArr){
        const sql = `INSERT INTO appraisal(buildNumber, dormitoryNumber, violations, neatItems, score,checkDate,instructName)  SELECT ?,?,?,?,?,NOW(),instructName FROM student WHERE buildNumber = ? AND dormitoryNumber = ?;`;
        return (promise = new Promise((resolve, reject)=>{
            pool.query(sql, paramArr, callback(resolve, reject));
        }))
    }
    

};