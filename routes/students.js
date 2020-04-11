var express = require('express');
var router = express.Router();
const StudentCurd = require('../model/StudentCurd');
const multer = require('multer');
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
        //通过宿舍号查询
        StudentCurd.findStubAndDormitoryNumber(param).then(data(req, res));
      } else if (param.grade || param.profession || param.department) {
        StudentCurd.findStub(param).then(data(req, res));
      } else if (param.name || param.studentNumber) {
        StudentCurd.findStubNameAndId(param).then(data(req, res));
      }
    }
  } /* else if (param.type === 'updateNull') {
    //完善信息
    StudentCurd.insertMessage(param).then(data(req, res));
  } */ else if (param.type === 'delete') {
    //删除信息
    StudentCurd.deleteByStudentNumber(param).then(data(req, res));
  } /* else if (param.type === 'insert') {//导员导入信息
    excel('text.xlsx', function (data) {
      if (!data.err) {
        for (let i in data) {
          let arr = [];
          for (let j in Object.values(data[i])) {
            arr[j] = Object.values(data[i])[j];
          }
          StudentCurd.insertByInstruct(arr, function(err){
            if(err){
              res.send(err);
            }
          });
          res.send('success');
        }
      } else {
        console.log(data.err);
      }
    });
  } */
});

//导员批量导入信息
/* router.post('/insert', multer({
  dest: 'public/xlsx'
}).single('file'), function(req, res, next){
  if(req.file.length === 0){
    return res.json({error : '上传文件不能为空'});
  }else{
    res.json('success');
  }
}) */

//导员修改信息
router.post('/update', function(req, res){
  StudentCurd.updateMessage(param).then(data(req, res));
});

//导员新增学生信息单条插入 无插入值时如遇楼号和宿舍号必须返回NULL其余随意
router.post('/instructInsert', function (req, res) {
  const param = req.body;
  //插入单个信息
  StudentCurd.insertByOne(param).then(data(req, res));
});

function data(req, res) {
  return function (data) {
    let arr = [];
    if (!data.err) {
      const results = data.results;
        if(req.query.type === 'search'){
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
      }else {
        results.affectedRows === 0 ? res.json('false') : res.json('success');
      }
    } else {
      res.send(data.err);
    }
  };
}



module.exports = router;
