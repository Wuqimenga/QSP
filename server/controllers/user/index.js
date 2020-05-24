
//查看promise与async await的区别，以及为什么在js中使用异步函数
const bcrypt=require("bcrypt-nodejs");
const jwt=require("jsonwebtoken");
const _model=require('../../models/action');
const userSequelize=require('../../models/index').user;
//const config = require('../../../config');
module.exports = {
  login: async function (req, res, next) {
    var body={code:'01',result:''};
    try {
      var condition = {
        attributes:['userid','password'],
        where: {
          username: req.body.name
        }
      }
      var user = await _model.findOne(userSequelize, condition);
      if (!!user) {
        if(bcrypt.compareSync(req.body.password, user.password)){
          var token = jwt.sign({name:user.name}, req.session.secret, {
            expiresIn: 60*60*24
          })
          body.result=user;
          body.token=token;
        } else {
          body.code='02';
          body.result='密码输入有误';
        }
      } else {
        body.code='02';
        body.result='用户不存在,请先注册';
      }
    } catch (e) {
      body.code='02';
      body.result=e.message;
    }finally {
      res.json(body);
    }
  },
  register:  async function (req, res) {
    var body={code:'01',result:''};
    try{
      var result=await _model.create(userSequelize,req.body);
      body.result=result;
    }catch (e) {
      body.code='02';
      body.result=e.message;
    }finally {
      res.json(body);
    }
  },
}
