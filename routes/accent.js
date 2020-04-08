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
      res.json({ key: token });
    }
  });
});

router.get('/check', function (req, res, next) {
  let token = req.headers['authorization'];
  if (token) {
    const result = tokenUtil.checkToken(token);
    res.json({ status: result });
  } else {
    res.json({ status: false });
  }
});

module.exports = router;
