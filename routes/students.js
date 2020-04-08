var express = require('express');
var router = express.Router();
const StudentCurd = require('../model/StudentCurd');

router.get('/', function (req, res, next) {
  const param = req.query;
  console.log(param);
  if (param.type === 'search') {
    switch (param.mold) {
      case '0':
        //通过年级，专业，或二者组合来查找楼号和宿舍号
        if (!param.grade && !param.profession) {
          res.send('no found right query');
          break;
        } else {
          StudentCurd.findGradeAndProfession(param).then(data(req, res));
          break;
        }
      case '1':
        //通过宿舍号，楼号或二者组合来查找学生信息
        if (!param.dormitoryNumber && !param.buildNumber) {
          res.send('no found right query');
          break;
        } else {
          StudentCurd.findDormitory(param).then(data(req, res));
          break;
        }
      case '2':
        if (param.grade || param.profession || param.department) {
          //通过宿管号,年级,专业系别
          StudentCurd.findStub(param).then(data(req, res));
          break;
        } 
        case '3':
          if (param.dormitoryNumber) {
            //通过宿管号，宿舍号查询
            StudentCurd.findStubAndDormitoryNumber(param).then(data(req, res));
            break;
          } else if (param.name || param.studentNumber) {
            //通过学号姓名查询
            StudentCurd.findStubNameAndId(param).then(data(req, res));
            break;
          }
          
      default:
        res.send('本次请求未正确发送');
        break;
    }
  } else if (param.type === 'update') {
    //导员修改信息
    //先删除数据在插入
    /* StudentCurd.deleteByStudentNumber(param).then(data(req, res));
    console.log('1111111111111111');
    StudentCurd.updateMessage(param).then(data(req, res)); */
  } else if (param.type === 'updateNull') {
    //完善信息
    StudentCurd.insertMessage(param).then(data(req, res));
  } else if (param.type === 'delete') {
    StudentCurd.deleteByStudentNumber(param).then(data(req, res));
  }
});

function data(req, res) {
  return function (data) {
    if (!data.err) {
      const results = data.results;
      res.json(results);
    } else {
      console.log(data.err);
    }
  };
}


module.exports = router;
