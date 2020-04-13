var express = require('express');
var router = express.Router();
const StudentCurd = require('../model/StudentCurd');
const multer = require('multer');
const fs = require('fs');
const excel = require('../lib/excel-utils');
const img = require('../model/img');

router.get('/', function (req, res, next) {
  const param = req.query;
  console.log(param);
  if (param.type === 'search') {
    if (param.role === 'Controller') {
      if (param.grade || param.profession) {
        //按年级专业查询
        StudentCurd.findGradeAndProfession(param).then(data(req, res));
      } else {
        //按楼号宿舍号查询
        StudentCurd.findDormitory(param).then(data(req, res));
      }
    } else if (param.role === 'Instructor') {
      if (param.grade || param.profession || param.department) {
        //按年级系别专业查询
        StudentCurd.findGradeProfessionDepartment(param).then(data(req, res));
      } else {
        StudentCurd.findDormitory(param).then(data(req, res));
      }
    } else if (param.role === 'House') {
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
  } *//*  else if (param.type === 'delete') {
    
    //删除信息
    StudentCurd.deleteByStudentNumber(param).then(data(req, res));
  } */
});

//删除和批量删除
router.post('/delete', function (req, res) {
  const param = req.body;
  StudentCurd.deleteByStudentNumber(param).then(data(req, res));
});

//导员批量导入信息
router.post('/insert', multer({
  dest: 'public/xlsx'
}).single('file'), function (req, res, next) {
  if (req.file.length === 0) {
    return res.json({ error: '上传文件不能为空' });
  } else {
    let file = req.file;
    fs.renameSync('./public/xlsx/' + file.filename, './public/xlsx/' + file.originalname);
    excel(file.originalname, function (data) {
      if (!data.err) {
        for (let i in data) {
          let arr = [];
          for (let j in Object.values(data[i])) {
            arr[j] = Object.values(data[i])[j];
          }
          StudentCurd.insertByInstruct(arr, function (err,results) {
            if (err) {
              res.json(err);
            }
          });
        }
      } else {
        res.json(data.err);
      }
    });
  }
});

//导员修改信息TODO
router.post('/update', function (req, res) {
  const param = [{ studentNumber: "00000000", buildNumber: "软件6s1" }, { studentNumber: "00000002", class: "软工ss0" }];
  /* [{studentNumber: "00000000", profession: "软件1"},{studentNumber:"00000002", class:"软工"}]; */
  for (let i = 0; i < param.length; i++) {
    let sqlPinJie = null;
    let arrParam = [];
    let arrKey = Object.keys(param[i]);
    let index = arrKey.filter(item => item !== 'studentNumber');
    sqlPinJie = index[0] + '=?';
    arrParam[0] = Object.values(param[i])[1];
    for (let j = 1; j < index.length; j++) {
      if (index.length === 1) {
        break;
      } else {
        sqlPinJie += ',';
        sqlPinJie += index[j] + '=?';
        arrParam[j] = Object.values(param[i])[j];
      }
    }
    arrParam.push(Object.values(param[i])[0]);
    StudentCurd.updateMessage(sqlPinJie, arrParam).then(data(req, res));
  }
});

//导员新增学生信息单条插入 无插入值时如遇楼号和宿舍号必须返回NULL其余随意
/* router.post('/instructInsert', function (req, res) {
  const param = req.body;
  //插入单个信息
  StudentCurd.insertByOne(param).then(data(req, res));
}); */


//插入！！！！！！！！！！！
/* router.post('/instructInsert', function(req, res){
  const param = req.body;
  console.log(param);
  StudentCurd.insertMessage(param).then(data(req, res));
}); */
router.post('/instructInsert',multer({
  dest: 'public/img'
}).single('file'),function(req, res, next){
  if(req.file.length === 0){
    res.render("error",{messagr: "上传图片为空"});
    return;
  }else{
    let file = req.file;
    fs.renameSync('./public/img/' + file.filename, './public/img/' + file.originalname);
    const param = req.body;
    console.log(param);
    StudentCurd.insertMessage(param).then(data(req, res));
  }
});

//TODO
function data(req, res) {
  return function (data) {
console.log(data.results);

    if (!data.err) {
      const results = data.results;
      if (req.query.type === 'search') {
        let arrKey = null;
        if (data.results.length === 0) {
          arrKey = 'undefined';
        } else {
          arrKey = Object.keys(data.results[0]);
        }
        let modify = ['grade', 'profession', 'class', 'phoneNumber', 'fatherPhone', 'motherPhone', 'buildNumber', 'dormitoryNumber', 'instructName', 'instructPhone', 'dormitoryLeader', 'LeaderPhone'];
        let invariable = ['studentNumber', 'NAME', 'department', 'profession', 'grade', 'class', 'phoneNumber', 'fatherPhone', 'motherPhone']
        const status = req.query.role === 'Instructor' && (req.query.buildNumber || req.query.dormitoryNumber) ? res.json({ status: true, data: results, invariable: invariable, modify: modify }) : res.json({ status: true, data: results, invariable: arrKey, modify: undefined });
        status;
      } else {
        results.affectedRows === 0 ? res.json({ status: false }) : res.json({ status: true });
      }
    } else {
      res.send(data.err);
    }
  };
}



module.exports = router;
