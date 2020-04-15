var express = require('express');
var router = express.Router();
const AppraisalCurd = require('../model/AppraisalCurd');
//宿舍评比信息
router.post('/insertAppraisal', (req, res)=>{
    const param = req.body;
    /* let violations = param.  + param. + param. + param.; */
    /* let neatItems = param. + param. + param. */
    /* let score = 100 - (violations + neatItems); */
    let paramArr = [param.buildNumber,param.dormitoryNumber,violations,neatItems,score];
    
    AppraisalCurd.insertApprisal(paramArr).then(data(req, res));
});


function data(req, res) {
    return function (data) {
      if (!data.err) {
        const results = data.results;
       res.send(results);
      } else {
        res.send(data.err);
      }
    };
  }