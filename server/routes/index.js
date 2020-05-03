const express=require('express');
const jwt=require("jsonwebtoken");
const config = require('../../config');
// 建立 Router 物件
const router = express.Router();
var userContoller=require('../controllers/user')

// 在每一个请求被处理之前都会执行的middleware
router.use(function(req, res, next) {
  req.session.secret=config.dev.secret;//这个有什么用吗？
  if(req.url!='/login'&&req.url!='/register'&&req.url!='/get-questionnaire-to-answer'&&req.url!='/post-answers'){//如果不是登录和注册界面，就要对登录token验证
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, req.session.secret, function (err, decoded) {
        if (err) {
          return res.json({code:'03', result: 'Failed to authenticate token.'})
        } else {
          next();//next函数主要负责将控制权交给下一个中间件，如果当前中间件没有终结请求，并且next没有被调用，那么请求将被挂起，next函数主要是用来确保所有注册的中间件被一个接一个的执行，那么我们就应该在所有的中间件中调用next函数，但有一个特例，如果我们定义的中间件终结了本次请求，那就不应该再调用next函数
        }
      })
    } else {
      return res.json({code:'03', result: 'No token provided.'})
    }
  }else{
    // 输出记录信息
    console.log(req.method, req.url);
    // 继续路由处理
    next();
  }
});
router.post('/login', userContoller.login);
router.post('/register', userContoller.register);
router.post('/get-questionnaires',userContoller.get);
module.exports=router;
