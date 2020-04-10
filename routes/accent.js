const express = require('express');
const router = express.Router();
const AccentCurd = require('../model/AccentCurd');
const tokenUtil = require('../lib/token-units');

router.post('/login', function (req, res, next) {
  const param = req.body;
  AccentCurd.CheckAccent(param).then(function (data) {
    if (data.results.length === 0) {
      res.json({ error: '用户名或者密码错误' });
    } else {
      const user = data.results[0];
      let userInfo = {
        id: user.id,
        accent: user.accent,
        role: user.role,
      };
      const token = tokenUtil.createToken(userInfo);
      //TODO 
      res.json({ key: token });
    }
  });
});

router.get('/check', function (req, res, next) {
  let token = req.headers['authorization'];
  //token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiYWNjZW50Ijoic3R1YjEiLCJyb2xlIjoic3R1YiIsImlhdCI6MTU4NjQ5NTU0NSwiZXhwIjoxNTg2NTgxOTQ1fQ.LT1R9leyr58JmG09O03IDUneiQ0T0-zoNsVZo0i53sY'
  if (token) {
    const result = tokenUtil.checkToken(token);
    if (result[0]) {
      res.json({ status: result[0], role: result[1].role });
    } else {
      res.json({ status: false });
    }
    //res.json({ status: result[0], role: result[1].role});
  } else {
    res.json({ status: false });
  }
});

module.exports = router;
