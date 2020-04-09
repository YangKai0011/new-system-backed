const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const param = req.query || req.params;
  res.send('xxx');
});
//宿舍平面图
/* router.get('/*', function(req, res){
  const publicPath = path.resolve(__dirname, "../public");
  res.sendFile(publicPath + "/" + req.url);
}); */


module.exports = router;
