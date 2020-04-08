const pool = require('./operate');

let createAccent = `create table if not exists accents(
  id int primary key auto_increment,
  accent varchar(15) not null,
  password varchar(20) not null,
  role varchar(10)
);`;

let createStudent = `create table if not exists student(
	id int(11) PRIMARY KEY AUTO_INCREMENT,
	studentNumber varchar(11) UNICODE COMMENT '学号',
	NAME varchar(6) NOT NULL COMMENT '姓名',
	department varchar(20) NOT NULL COMMENT '系名',
	profession varchar(20) NOT NULL COMMENT '专业',
	grade varchar(10) NOT NULL COMMENT '年级',
  class varchar(20) NOT NULL COMMENT '班级',
  phoneNumber varchar(12) COMMENT '电话',
  instructName varchar(5) COMMENT '导员姓名',
	instructPhone varchar(11) COMMENT '导员电话',
	buildNumber int(11) COMMENT '楼号',
	dormitoryNumber INT(11) COMMENT '宿舍号',
	dormitoryLeader varchar(5) COMMENT '宿舍长',
	LeaderPhone varchar(11) COMMENT '宿舍长电话',
	fatherPhone varchar(11) COMMENT '父亲电话',
	motherPhone varchar(11) COMMENT '母亲电话',
	photo varchar(100) COMMENT '图片保存路径'
)`;

module.exports = function () {
  pool.query(createAccent, function (err, results, fields) {
    if (err) {
      console.log(err);
    }
  });
  pool.query(createStudent, function (err, results, fields) {
    if (err) {
      console.log(err);
    }
  });
};
