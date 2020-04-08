module.exports = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Expose-Headers', '*');
  // 新增加cors 运行的请求头
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
  );
  //预检测请求直接返回200
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  }
  next();
};
