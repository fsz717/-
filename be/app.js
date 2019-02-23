var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var session = require('express-session')
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//positions路由 是一个中间键
var positionsRouter = require('./routes/positions');
var usersRouter = require('./routes/users');
var app = express();//创建服务器

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//express-session保持登录，可以看老师的D:\千峰老师代码\第三阶段\Day20\vue_Day10\lagou-admin-be2\controllers\userControl
// app.use(session({
//   secret:'h51802',//密钥cookie的密钥，一般随机的16位字符
//   resave:false,//每次请求完重新保存
//   saveUninitialized:true,//强制未初始化的session保存
//   cookie:{
//     maxAge:1000*4,//设置session持续生效的时间
//   }
// }))

//设置允许跨域 cors方法
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true")
  // res.header("Access-Control-Allow-Origin", "http://localhost:7170")//指定端口号，真正允许跨域的一句话，这就是cors核心
  res.header("Access-Control-Allow-Origin", "*")//设置所有都能访问
  //res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500")
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


//设置允许跨域 我方服务器做代理方法（使用正向代理，服务器不知道客户端的存在，是我方服务器在做代理访问服务器）
//反向代理（会存在一个负载均衡nginx,针对服务器的，客服端的请求给服务器，服务器把这个请求发给对应服务器，然后再把返回的数据传给客户端）


//全局拦截器
const Authorization = (req, res, next) => {
  console.log(req.path)
  let token = req.body.token || req.query.token || req.headers['authoration'];
  let secrect = 'fsz';
  if (req.path == '/users/login'|| req.path == '/users/register') {
    //为登录和注册不需要拦截
    next()
  } else {
      jwt.verify(token, secrect, (err, decode) => {
        console.log(decode)
        if (err) {//token没有或者失效时
          res.send({ status: 304, msg: '无效的验证' })
        } else {
          if(req.path!=='/users/check'){
            next()
          }else{
             res.send({ status: 200,msg:"验证成功", userName: decode.userName })
          }
        }
      })
    }
  }
//拦截所有
app.use('/',Authorization)
//路由
app.use('/positions',positionsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
