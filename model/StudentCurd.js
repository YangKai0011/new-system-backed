const pool = require('../dbunit/operate');

function callback(resolve, reject) {
  return function (err, results, fields) {
    resolve({ err: err, results: results, fields: fields });
    reject({ err: err });
  }
}
//宿管需要查询的信息
let filed = 'studentNumber,NAME,department,profession,grade,class,phoneNumber,instructName,instructPhone,dormitoryNumber,dormitoryLeader,LeaderPhone,fatherPhone,motherPhone';
module.exports = {

  //按照宿舍号楼号查找所有成员
  findDormitory(param) {
    const field = param.dormitoryNumber !== 'undefined' && param.buildNumber !== 'undefined' ? 'and' : 'or';
    const role = param.role === 'Controller' ? 'NAME,department,profession,grade,phoneNumber,instructName,instructPhone,dormitoryLeader,LeaderPhone' : 'studentNumber,NAME,department,profession,grade,class,phoneNumber,buildNumber,dormitoryNumber,instructName,instructPhone,dormitoryLeader,LeaderPhone,fatherPhone,motherPhone';
    const sql = `SELECT  ${role}  FROM student WHERE buildNumber=? ${field} dormitoryNumber=?`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.buildNumber, param.dormitoryNumber], callback(resolve, reject));
    }));
  },

  //通过专业和年级查找宿舍成员分布
  findGradeAndProfession(param) {
    //模糊查询
    const profession = param.profession
    const field = param.grade !== 'undefined' && param.profession !== 'undefined' ? 'and' : 'or';
    const sql = `select DISTINCT buildNumber, dormitoryNumber from student where grade=? ${field} profession like '%${profession}%'`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.grade], callback(resolve, reject));
    }));
  },
  //通过专业,年级,系别查找宿舍成员分布
  findGradeProfessionDepartment(param) {
    const profession = param.profession;//模糊查询
    const field = param.grade !== 'undefined' && param.profession !== 'undefined' ? 'and' : 'or';
    const sql = `select DISTINCT buildNumber, dormitoryNumber from student where department=? and (grade=? ${field} profession like '%${profession}%')`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.positions, param.grade], callback(resolve, reject));
    }));
  },

  //通过宿管号,年级，专业，系别来查询学生信息
  findStub(param) {
    if (Object.keys(param).length === 6) {
      let sqlPinJie = null; let sqlArr = [];
      const positions = param.positions;
      //删除无关的键值对
      delete param.type; delete param.role; delete param.positions
      let arr = Object.keys(param);
      const index = arr.filter(item => param[item] !== 'undefined');
      console.log(index);
      switch (index.length) {
        case 1:
          sqlPinJie = index + '=?';
          sqlArr = [positions, param[index]];
          break;
        case 2:
          sqlPinJie = index[0] + '=? and ' + index[1] + '=? ';
          sqlArr = [positions, param[index[0]], param[index[1]]];
          break;
        case 3:
          sqlPinJie = index[0] + '=? and ' + index[1] + ' =? ' + ' and ' + index[2] + '=?';
          sqlArr = [positions, param[index[0]], param[index[1]], param[index[2]]];
          break;
      }
      param['type'] = 'search'; param['role'] = 'House'; param['positions'] = positions;
      const sql = `SELECT  ${filed} FROM  student WHERE buildNumber=? and (${sqlPinJie})`;
      return (promise = new Promise(function (resolve, reject) {
        pool.query(sql, sqlArr, callback(resolve, reject));
      }));
    }
  },
  //通过宿管号，宿舍号来查询学生信息
  findStubAndDormitoryNumber(param) {
    const sql = `SELECT ${filed} FROM  student WHERE buildNumber=? and dormitoryNumber=?`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.positions, param.dormitoryNumber], callback(resolve, reject));
    }));
  },

  //通过宿管号,学号，姓名查询学生信息
  findStubNameAndId(param) {
    const name = param.name;
    const field = param.studentNumber !== 'undefined' && param.name !== 'undefined' ? 'and' : 'or';
    const sql = `SELECT * FROM  student WHERE buildNumber=? and (studentNumber=? ${field} name like '%${name}%')`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.positions, param.studentNumber], callback(resolve, reject));
    }));
  },
  //导员修改信息TODO
  updateMessage(sqlPinJie, arrParam, callback) {
    const sql = `update student set ${sqlPinJie}  where studentNumber=?`;
    pool.getConnection(function (err, conn) {
      if (err) throw err;
      conn.beginTransaction(function (err) {
        try {
          if (err) throw err;
          conn.query(sql, arrParam, function (err, results) {
            if (err) {
              console.log(err);
              console.log(err.sql);
              //回滚事务
              conn.rollback(function () {
                return callback(err.sql);
              });
            } else {
              console.log('提交事务');
              conn.commit(function () {
                console.log('success');
              })
            }
          });
        } finally {
          conn.release();
        }
      });
    });
  },
  //完善信息
  insertMessage(param) {
    const sql = 'UPDATE student SET buildnumber=?,dormitorynumber=?,phoneNumber=?,instructName=?,instructPhone=?, dormitoryLeader=?, LeaderPhone=?, fatherphone=?, motherphone=? WHERE studentNumber=?';
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, [param.buildnumber, param.dormitorynumber, param.phoneNumber, param.instructName, param.instructPhone, param.dormitoryLeader, param.LeaderPhone, param.fatherphone, param.motherphone, param.studentNumber], callback(resolve, reject));
    }));
  },

  //删除学生信息TODO
  deleteByStudentNumber(param) {
    let sqlPinJie = param[0];
    for (let i = 1; i < param.length; i++) {
      if (param.length === 1) {
        break;
      } else {
        sqlPinJie += ',';
        sqlPinJie += param[i];
      }
    }
    const sql = `delete from student where studentNumber in(${sqlPinJie})`;
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, callback(resolve, reject));
    }));
  },

  //导员导入信息
  insertByInstruct(param, callback) {
    console.log(param);
    const sql = 'insert into student(studentNUmber, name, department, profession, grade, class) values(?,?,?,?,?,?)';
    pool.getConnection(function (err, conn) {
      if (err) throw err;
      conn.beginTransaction(function (err) {
        try {
          if (err) throw err;
          conn.query(sql, param, function (err, results) {
            if (err) {
              console.log(err);
              console.log(err.sql);
              //回滚事务
              conn.rollback(function () {
                return callback(err.sql);
              });
            } else {
              console.log('提交事务');
              conn.commit(function () {
                console.log('success');
              });
            }
          });
        } finally {
          conn.release();

        }
      });
    });


  },
  //导员单个插入信息
  insertByOne(param) {
    console.log(param);
    let arr = [];
    for (let i = 0; i < Object.keys(param).length; i++) {
      arr[i] = Object.values(param)[i];
    }
    console.log(arr);
    const sql = 'INSERT INTO student(studentNumber,NAME,department,profession,grade,class,phoneNumber,instructName,instructPhone,buildNumber,dormitoryNumber,dormitoryLeader,LeaderPhone,fatherPhone,motherPhone) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
    return (promise = new Promise(function (resolve, reject) {
      pool.query(sql, arr, callback(resolve, reject));
    }));
  }
};
