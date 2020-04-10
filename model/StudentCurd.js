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
    const role = param.role === '学工部' ? 'NAME,department,profession,grade,phoneNumber,instructName,instructPhone,dormitoryLeader,LeaderPhone' : 'studentNumber,NAME,department,profession,grade,class,phoneNumber,fatherPhone,motherPhone';
    const sql = `SELECT  ${role}  FROM student WHERE buildNumber=? ${field} dormitoryNumber=?`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.buildNumber, param.dormitoryNumber], callback(resolve, reject));
    }));
  },

  //通过专业和年级查找宿舍成员分布
  findGradeAndProfession(param) {
    const field = param.grade !== 'undefined' && param.profession !== 'undefined' ? 'and' : 'or';
    const sql = `select DISTINCT buildNumber, dormitoryNumber from student where grade=? ${field} profession=?`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.grade, param.profession], callback(resolve, reject));
    }));
  },
  //通过专业,年级,系别查找宿舍成员分布
  findGradeProfessionDepartment(param) {
    const field = param.grade !== 'undefined' && param.profession !== 'undefined'  && param.department !== 'undefined'? 'and' : 'or';
    const sql = `select DISTINCT buildNumber, dormitoryNumber from student where grade=? ${field} profession=? ${field} department=?`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.grade, param.profession, param.department], callback(resolve, reject));
    }));
  },

  //通过宿管号,年级，专业，系别来查询学生信息
  findStub(param) {
    const field = param.grade !== 'undefined' && param.profession !== 'undefined' && param.department !== 'undefined' ? 'and' : 'or';
    const sql = `SELECT  studentNumber,NAME,department,profession,grade,class,phoneNumber,instructName,instructPhone,buildNumber,dormitoryNumber,dormitoryLeader,LeaderPhone,fatherPhone,motherPhone FROM  student WHERE buildNumber=? and (grade=? ${field} profession=? ${field} department=?)`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.buildNumber, param.grade, param.profession, param.department], callback(resolve, reject));
    }));
  },
  //通过宿管号，宿舍号来查询学生信息
  findStubAndDormitoryNumber(param) {
    const sql = 'SELECT studentNumber,NAME,department,profession,grade,class,phoneNumber,instructName,instructPhone,buildNumber,dormitoryNumber,dormitoryLeader,LeaderPhone,fatherPhone,motherPhone FROM  student WHERE buildNumber=? and dormitoryNumber=?';
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.buildNumber, param.dormitoryNumber], callback(resolve, reject));
    }));
  },

  //通过宿管号,学号，姓名查询学生信息
  findStubNameAndId(param) {
    const field = param.studentNumber !== 'undefined' && param.name !== 'undefined' ? 'and' : 'or';
    const sql = `SELECT  studentNumber,NAME,department,profession,grade,class,phoneNumber,instructName,instructPhone,buildNumber,dormitoryNumber,dormitoryLeader,LeaderPhone,fatherPhone,motherPhone FROM  student WHERE buildNumber=? and (studentNumber=? ${field} name=?)`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.buildNumber, param.studentNumber, param.name], callback(resolve, reject));
    }));
  },
  //导员修改信息
  updateMessage(param) {
    const sql = 'update student set department=?,profession=?,grade=?,class=?,phoneNumber=?,fatherPhone=?,motherPhone=?,buildNumber=?,dormitoryNumber=?,instructName=?,instructPhone=?,dormitoryLeader=?,LeaderPhone=? where studentNumber=?';
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.department, param.profession, param.grade, param.class, param.phoneNumber, param.fatherPhone, param.motherphone, param.buildNumber, param.dormitoryNumber, param.instructName, param.instructPhone, param.dormitoryLeader, param.LeaderPhone, param.studentNumber],
        callback(resolve, reject));
    }));

  },
  //完善信息
  insertMessage(param) {
    const sql = 'UPDATE student SET buildnumber=?,dormitorynumber=?,phoneNumber=?,instructName=?,instructPhone=?, dormitoryLeader=?, LeaderPhone=?, fatherphone=?, motherphone=? WHERE studentNumber=?';
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.buildnumber, param.dormitorynumber, param.phoneNumber, param.instructName, param.instructPhone, param.dormitoryLeader, param.LeaderPhone, param.fatherphone, param.motherphone, param.studentNumber], callback(resolve, reject));
    }));
  },

  //删除学生信息
  deleteByStudentNumber(param) {
    const sql = 'delete from student where studentNumber=?';
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, param.studentNumber, callback(resolve, reject));
    }));
  },

  //导员导入信息
  insertByInstruct(param) {
    const sql = 'insert into student(studentNUmber, name, department, profession, grade, class) values(?,?,?,?,?,?)';
    pool.query(sql, param);
  }
};
