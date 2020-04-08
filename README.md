# systm-backend

## 框架
express

## 接口

### /user

/login 
- 成功返回{key:token}
- 失败返回{ error: '用户名或者密码错误' }

/check 
- 成功返回{ status: true }
- 失败返回{ status: false }