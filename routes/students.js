var express = require('express');
var router = express.Router();
const StudentCurd = require('../model/StudentCurd');
const excel = require('../lib/excel-utils');
router.get('/', function (req, res, next) {
  const param = req.query;
  console.log(param);
  if (param.type === 'search') {
    if (param.role === '学工部') {
      if (param.grade || param.profession) {
        //按年级专业查询
        StudentCurd.findGradeAndProfession(param).then(data(req, res));
      } else {
        //按楼号宿舍号查询
        StudentCurd.findDormitory(param).then(data(req, res));
      }
    } else if (param.role === '导员') {
      if (param.grade || param.profession || param.department) {
        //按年级系别专业查询
        StudentCurd.findGradeProfessionDepartment(param).then(data(req, res));
      } else {
        StudentCurd.findDormitory(param).then(data(req, res));
      }
    } else if (param.role === '宿管') {
      if (param.dormitoryNumber) {
        StudentCurd.findStubAndDormitoryNumber(param).then(data(req, res));
      } else if (param.grade || param.profession || param.department) {
        StudentCurd.findStub(param).then(data(req, res));
      } else if (param.name || param.studentNumber) {
        StudentCurd.findStubNameAndId(param).then(data(req, res));
      }
    }
  } else if (param.type === 'update') {
    //导员修改信息
    StudentCurd.updateMessage(param).then(data(req, res));
  } else if (param.type === 'updateNull') {
    //完善信息
    StudentCurd.insertMessage(param).then(data(req, res));
  } else if (param.type === 'delete') {
    //删除信息
    StudentCurd.deleteByStudentNumber(param).then(data(req, res));
  } else if (param.type === 'insert') {//导员导入信息
    excel('text.xlsx', function (data) {
      if (!data.err) {
        for (let i in data) {
          let arr = [];
          console.log(Object.values(data[i]));
          for (let j in Object.values(data[i])) {
            arr[j] = Object.values(data[i])[j];
          }
          StudentCurd.insertByInstruct(arr);
        }
        res.send('导入成功！');
      } else {
        console.log(data.err);
      }


    });
  }
});

function data(req, res) {
  return function (data) {
    let arr = [];
    if (!data.err) {
      const results = data.results;
      if (req.query.role === '学工部' || req.query.role === '导员' || req.query.role === '宿管') {
        for (let i = 0; i < results.length; i++) {
          if (req.query.role === '学工部') {
            if (req.query.grade || req.query.profession) {
              var map = { 楼号: null, 宿舍号: null };
            } else {
              var map = { 姓名: null, 系名: null, 专业: null, 年级: null, 电话: null, 导员姓名: null, 导员电话: null, 宿舍长: null, 宿舍长电话: null };
            }
          } else if (req.query.role === '导员') {
            if (req.query.grade || req.query.profession || req.query.department) {
              var map = { 楼号: null, 宿舍号: null };
            } else {
              var map = { 学号: null, 姓名: null, 系名: null, 专业: null, 年级: null, 班级: null, 电话: null, 父亲电话: null, 母亲电话: null };
            }
          } else if (req.query.role === '宿管') { var map = { 学号: null, 姓名: null, 系名: null, 专业: null, 年级: null, 班级: null, 电话: null, 导员姓名: null, 导员电话: null, 宿舍号: null, 宿舍长: null, 宿舍长电话: null, 父亲电话: null, 母亲电话: null }; }

          for (let j = 0; j < Object.values(results[i]).length; j++) {
            map[Object.keys(map)[j]] = Object.values(results[i])[j];
          }
          arr[i] = map;
        }
        res.json(arr);
      } else {
        console.log(results.affectedRows);
        if(results.affectedRows === 0){
          res.json('false');
        }else{
          res.json('success');
        }
        
      }
    } else {
      console.log(data.err);
    }
  };
}



module.exports = router;
