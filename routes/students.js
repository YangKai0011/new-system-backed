var express = require('express');
var router = express.Router();
const StudentCurd = require('../model/StudentCurd');
const multer = require('multer');
const fs = require('fs');
const excel = require('../lib/excel-utils');


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
router.post('/delete', function(req, res){
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
          StudentCurd.insertByInstruct(arr, function (err) {
            if (err) {
              res.send(err);
            }
          });
        }
        res.send('文件上传成功并且导入成功');
      } else {
        res.json(data.err);
      }
    });
  }
});

//导员修改信息
router.post('/update', function (req, res) {
  const param = req.body;
  StudentCurd.updateMessage(param).then(data(req, res));
});

//导员新增学生信息单条插入 无插入值时如遇楼号和宿舍号必须返回NULL其余随意
router.post('/instructInsert', function (req, res) {
  const param = req.body;
  //插入单个信息
  StudentCurd.insertByOne(param).then(data(req, res));
});

//TODO
function data(req, res) {
  return function (data) {
   /*  var map = {};
    console.log(Object.keys(data.results[0])[0]);
    console.log(Object.values(data.results).length);
    console.log('111111111111');
    const keyArr = Object.keys(data.results[0]);
    //const length = Object.keys(data.results[0]).length;
   const valueArr = Object.values(data.results[0]);
   
   
    for(let i = 0; i < Object.keys(data.results[0]).length; i++){
          map[Object.keys(data.results[0])[i]] = null;
    }
    console.log(map); */
    
    
    
    
    
    
    let arr = [];
    if (!data.err) {
      const results = data.results;
      if (req.query.type === 'search') {
        for (let i = 0; i < results.length; i++) {
          if (req.query.role === 'Controller') {
            if (req.query.grade || req.query.profession) {
              var map = { buildNumber: null, dormitoryNumber: null };
            } else {
              var map = { name: null, department: null, profession: null, grade: null, phoneNumber: null,instructName: null, instructPhone: null, dormitoryLeader: null, LeaderPhone: null };
            }
          } else if (req.query.role === 'Instructor') {
            if (req.query.grade || req.query.profession || req.query.department) {
              var map = { buildNumber: null, dormitoryNumber: null };
            } else {
              var map = { studentNumber: null, name: null, department: null, profession: null, grade: null, class: null, phoneNumber: null,buildNumber: null ,dormitoryNumber: null,instructName: null, instructPhone: null, dormitoryLeader: null, LeaderPhone: null, fatherPhone: null, motherPhone: null };
            }
          } else if (req.query.role === 'House') { var map = { studentNumber: null, name: null, department: null, profession: null, grade: null, class: null, phoneNumber: null, instructName: null, instructPhone: null, dormitoryNumber: null, dormitoryLeader: null, LeaderPhone: null, fatherPhone: null, motherPhone: null }; }

          for (let j = 0; j < Object.values(results[i]).length; j++) {
            map[Object.keys(map)[j]] = Object.values(results[i])[j];
          }
          arr[i] = map;
        }
        let number = ['grade','profession','class','phoneNumber','fatherPhone','motherPhone','buildNumber','dormitoryNumber','instructName','instructPhone','dormitoryLeader','LeaderPhone'];
        let numbers = ['studentNumber', 'name', 'department','grade','profession','class','phoneNumber','fatherPhone','motherPhone']
        
        if(req.query.role === 'Instructor' && (req.query.buildNumber || req.query.dormitoryNumber)){
          res.json({status: true, data: arr, invariable:numbers, modify: number});
        }else{
          res.json({status: true, data: arr});
        }
        
      } else {
        results.affectedRows === 0 ? res.json({status: false}) : res.json({status: true});
      }
    } else {
      res.send(data.err);
    }
  };
}



module.exports = router;
