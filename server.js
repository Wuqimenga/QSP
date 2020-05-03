var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
const router=require('./server/routes');
var http = require('http');
var app = express();

//body 解析
app.use(bodyParser.json());//一个HTTP请求体解析中间件，使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体。请求体解析后，解析值都会被放到req.body属性，内容为空时是一个{}空对象。
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
  secret: 'vue',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000  //session过期时间
  },
  name: 'vue-project'
}
));

var port = process.env.PORT || 8081;
// 将路由用至应用程式
app.use('/api/v1', router);//使用router中定义的匹配规则

var httpServer = http.createServer(app);
httpServer.listen(port, '0.0.0.0', function () {//'0.0.0.0'用作服务端，表示本机上任意ipv4地址
  console.log('Vue BackEnd Server is running on: http://%s:%s', 'localhost', port);
});
httpServer.on('error', onError);
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  //处理特殊error 的友好信息
  switch (error.code) {
    case 'EACCES':
      console.error('requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('端口被占用!');
      process.exit(1);
      break;
    default:
      throw error;
  }
}