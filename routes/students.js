var express = require('express');
var router = express.Router();
const StudentCurd = require('../model/StudentCurd');
const excel = require('../lib/excel-utils');
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
      if (req.query.mold === '1' || req.query.mold === '2' || req.query.mold === '3') {
        for (let i = 0; i < results.length; i++) {
          let map = {
            学号: null, 姓名: null, 系名: null, 专业: null, 年级: null,
            班级: null, 电话: null, 导员姓名: null, 导员电话: null, 楼号: null,
            宿舍号: null, 宿舍长: null, 宿舍长电话: null, 父亲电话: null, 母亲电话: null
          };
          for (let j = 0; j < Object.values(results[i]).length; j++) {
            map[Object.keys(map)[j]] = Object.values(results[i])[j];
          }
          arr[i] = map;
        }
        res.json(arr);
      }else if(req.query.mold === '0'){
        for (let i = 0; i < results.length; i++) {
          let map = {
            楼号: null,
            宿舍号: null
          };
          for (let j = 0; j < Object.values(results[i]).length; j++) {
            map[Object.keys(map)[j]] = Object.values(results[i])[j];
          }
          arr[i] = map;
        }
        res.json(arr);
      }else{
        res.json(results);
      }
    } else {
      console.log(data.err);
    }
  };
}



module.exports = router;
