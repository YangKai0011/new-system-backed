const pool = require('../dbunit/operate');

function callback(resolve, reject) {
  return function (err, results, fields) {
    resolve({ err: err, results: results, fields: fields });
    reject({ err: err });
  }
}


module.exports = {
  //按照宿舍号楼号查找所有成员
  findDormitory(param) {
    const field = param.dormitoryNumber !== 'undefined' && param.buildNumber !== 'undefined' ? 'and' : 'or';
    const sql = `select * from student where dormitoryNumber=? ${field} buildNumber=?`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.dormitoryNumber, param.buildNumber], callback(resolve, reject));
    }));
  },

  //通过专业和年级查找宿舍成员
  findGradeAndProfession(param) {
    const field = param.grade !== 'undefined' && param.profession !== 'undefined' ? 'and' : 'or';
    const sql = `select DISTINCT buildNumber, dormitoryNumber from student where grade=? ${field} profession=?`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.grade, param.profession], callback(resolve, reject));
    }));
  },

  //通过宿管号,年级，专业，系别来查询学生信息
  findStub(param){
    const field = param.grade !== 'undefined' && param.profession !== 'undefined' && param.department !== 'undefined' ? 'and' : 'or';
    const sql =  `SELECT  * FROM  student WHERE buildNumber=(SELECT stubNumber FROM stub WHERE accountNumber=?) and (grade=? ${field} profession=? ${field} department=?)`;
    return (promise = new Promise(function(resolve,reject){
      pool.query(sql, [param.accountNumber, param.grade, param.profession, param.department],callback(resolve, reject));
      }));   
  },
  //通过宿管号，宿舍号来查询学生信息
  findStubAndDormitoryNumber(param){
    const sql =  'SELECT  * FROM  student WHERE buildNumber=(SELECT stubNumber FROM stub WHERE accountNumber=?) and dormitoryNumber=?';
    return (promise = new Promise(function(resolve,reject){
      pool.query(sql, [param.accountNumber, param.dormitoryNumber],callback(resolve, reject));
      }));
  },

  //通过宿管号,学号，姓名查询学生信息
  findStubNameAndId(param){
    const field = param.studentNumber !== 'undefined' && param.name !== 'undefined' ? 'and' : 'or';
    const sql =  `SELECT  * FROM  student WHERE buildNumber=(SELECT stubNumber FROM stub WHERE accountNumber=?) and (studentNumber=? ${field} name=?)`;
    return (promise = new Promise(function(resolve,reject){
      pool.query(sql, [param.accountNumber, param.studentNumber, param.name],callback(resolve, reject));
      }));
  },
  //导员修改信息
 /*  updateMessage(param){
    const sql = 'delete from student where studentNumber=?';
    
  }, */
  //完善信息
  insertMessage(param){
    const sql = 'UPDATE student SET buildnumber=?,dormitorynumber=?,phoneNumber=?,instructName=?,instructPhone=?, dormitoryLeader=?, LeaderPhone=?, fatherphone=?, motherphone=? WHERE studentNumber=?';
    return (promise = new Promise(function(resolve,reject){
      pool.query(sql,[param.buildnumber, param.dormitorynumber, param.phoneNumber,param.instructName, param.instructPhone, param.dormitoryLeader, param.LeaderPhone,  param.fatherphone, param.motherphone, param.studentNumber],callback(resolve, reject));
      }));
  },

  //删除学生信息
  deleteByStudentNumber(param){
    const sql = 'delete from student where studentNumber=?';
    return (promise = new Promise(function(resolve, reject){
      pool.query(sql, param.studentNumber, callback(resolve, reject));
    }));

  },
};
