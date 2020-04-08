const express = require('express');
const router = express.Router();
const StudentCurd = require('../model/StudentCurd');
const path = require('path');
const excel = require('../lib/excel-utils');
/* GET home page. */



router.get('/', function (req, res, next) {
  const param = req.query || req.params;
  res.send('xxx');
});
/* router.get('/*', function(req, res){
  const publicPath = path.resolve(__dirname, "../public");
  res.sendFile(publicPath + "/" + req.url);
}); */

router.get('/excel/all', function (req, res, next) {
  excel('text.xlsx',function(data){
    res.send(data);
    console.log('1111111111111111111111');
    console.log(data);
  });


});

module.exports = router;
