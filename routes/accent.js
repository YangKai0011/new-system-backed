const express = require('express');
const multer = require('multer');
const router = express.Router();
const AccentCurd = require('../model/AccentCurd');
const tokenUtil = require('../lib/token-units');

router.post('/login', function (req, res, next) {
  const param = req.body;
  AccentCurd.CheckAccent(param).then(function (data) {
    if (data.results.length === 0) {
      res.json({status: false ,error: '用户名或者密码错误' });
    } else {
      const user = data.results[0];
      let userInfo = {
        id: user.id,
        accent: user.accent,
        role: user.role,
        positions: user.positions
      };
      const token = tokenUtil.createToken(userInfo);
      res.json({ key: token, status: true });
    }
  });
});

router.get('/check', function (req, res, next) {
  const token = req.headers['authorization'];
  if (token) {
    const result = tokenUtil.checkToken(token);
    const arr = result[0] ? res.json({status: result[0], role: result[1].role, positions: result[1].positions}) : res.json({ status: false });
    arr;
  } else {
    res.json({ status: false });
  }
});

module.exports = router;
