# systm-backend

## 框架
express

## 接口
http://127.0.0.1:3000

### /user

/login 
- 成功返回{key:token}
- 失败返回{ error: '用户名或者密码错误' }

/check 
- 成功返回{ status: true }
- 失败返回{ status: false }

### /students

请求路径: /?type=search&role=Controller&grade:可选&profession:可选
返回结果: '{"status":true,"data":[{"buildNumber":2,"dormitoryNumber":515}],"invariable":["buildNumber","dormitoryNumber"]}'

请求路径:/?type=search&role=Controller&buildNumber:可选&dormitoryNumber:可选
返回结果: '{"status":true,"data":[{"NAME":"张三","department":"计算机系","profession":"ads","grade":"大一","phoneNumber":"12545841251","instructName":"里卡","instructPhone":"123123","dormitoryLeader":"3","LeaderPhone":"4"}],"invariable":["NAME","department","profession","grade","phoneNumber","instructName","instructPhone","dormitoryLeader","LeaderPhone"]}'

请求路径: /?type=search&role=Instructor&grade:可选&profession:可选&positions:可选
返回结果: '{"status":true,"data":[{"buildNumber":1,"dormitoryNumber":515},{"buildNumber":null,"dormitoryNumber":null}],"invariable":["buildNumber","dormitoryNumber"]}'

请求路径: /?type=search&role=Instructor&dormitoryNumber:可选&buildNumber:可选
返回结果: '{"status":true,"data":[{"studentNumber":"00000004","NAME":"柯南","department":"警察系","profession":"刑侦","grade":"大二","class":"刑侦3班","phoneNumber":"12545891251","buildNumber":2,"dormitoryNumber":515,"instructName":"毛利兰","instructPhone":"12357895115","dormitoryLeader":"工藤新一","LeaderPhone":"70201452012","fatherPhone":"36259178521","motherPhone":"36254045281"}],"invariable":["studentNumber","NAME","department","profession","grade","class","phoneNumber","fatherPhone","motherPhone"],"modify":["grade","profession","class","phoneNumber","fatherPhone","motherPhone","buildNumber","dormitoryNumber","instructName","instructPhone","dormitoryLeader","LeaderPhone"]}'

请求路径: /?type=search&role=House&positions:可选&dormitoryNumber:可选
返回结果: '{"status":true,"data":[{"studentNumber":"00000004","NAME":"柯南","department":"警察系","profession":"刑侦","grade":"大二","class":"刑侦3班","phoneNumber":"12545891251","instructName":"毛利兰","instructPhone":"12357895115","dormitoryNumber":515,"dormitoryLeader":"工藤新一","LeaderPhone":"70201452012","fatherPhone":"36259178521","motherPhone":"36254045281"}],"invariable":["studentNumber","NAME","department","profession","grade","class","phoneNumber","instructName","instructPhone","dormitoryNumber","dormitoryLeader","LeaderPhone","fatherPhone","motherPhone"]}'

请求路径: /?type=search&role=House&positions=1&grade:可选&profession:可选&department:可选
返回结果: '{"status":true,"data":[{"studentNumber":"00000001","NAME":"一一","department":"计算机系","profession":"afds","grade":"大二","class":"软工1班","phoneNumber":"12545841231","instructName":"二二","instructPhone":"12354595145","dormitoryNumber":517,"dormitoryLeader":"三三","LeaderPhone":"35201452012","fatherPhone":"31254178521","motherPhone":"36254145481"}],"invariable":["studentNumber","NAME","department","profession","grade","class","phoneNumber","instructName","instructPhone","dormitoryNumber","dormitoryLeader","LeaderPhone","fatherPhone","motherPhone"]}'

请求路径: /?type=search&role=House&positions=1&name=%E4%B8%80%E4%B8%80&studentNumber=00000001
返回结果: '{"status":true,"data":[{"id":2,"studentNumber":"00000001","NAME":"一一","department":"计算机系","profession":"afds","grade":"大二","class":"软工1班","phoneNumber":"12545841231","instructName":"二二","instructPhone":"12354595145","buildNumber":1,"dormitoryNumber":517,"dormitoryLeader":"三三","LeaderPhone":"35201452012","fatherPhone":"31254178521","motherPhone":"36254145481","photo":null}],"invariable":["id","studentNumber","NAME","department","profession","grade","class","phoneNumber","instructName","instructPhone","buildNumber","dormitoryNumber","dormitoryLeader","LeaderPhone","fatherPhone","motherPhone","photo"]}'