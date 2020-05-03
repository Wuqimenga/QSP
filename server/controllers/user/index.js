
//查看promise与async await的区别，以及为什么在js中使用异步函数
const bcrypt=require("bcrypt-nodejs");
const jwt=require("jsonwebtoken");
const _model=require('../../models/action');
const userSequelize=require('../../models/index').control_user;
const config = require('../../../config');
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
      console.log(req.body);
      var result=await _model.create(userSequelize,req.body);
      body.result=result;
    }catch (e) {
      body.code='02';
      body.result=e.message;
    }finally {
      res.json(body);
    }
  },
  get: async function(req,res){
    var body={code:'01',result:''};
    var data=[
      {paperID:"003",title:"微信对社交的影响",isPublish:true,userID:"003",createTime:"2017-01-01"},
      {paperID:"004",title:"手机对社交的影响",isPublish:false,userID:"003",createTime:"2017-01-02"},
      {paperID:"005",title:"羽毛球对社交的影响",isPublish:false,userID:"003",createTime:"2017-01-03"},
      {paperID:"006",title:"家人对社交的影响",isPublish:true,userID:"003",createTime:"2016-01-02"},
      {paperID:"007",title:"微博对社交的影响",isPublish:false,userID:"003",createTime:"2018-01-02"},
    ]
    var result=[]
    try{
      if(req.body.explore==='true'){
          for(let i=0;i<data.length;i++)
          {
            if(req.body.questionnaireName===data[i].title){
              result.push(data[i]);
            }
          }
          console.log("explore")
      }
      else{
        if(req.body.status=="0")
        {
          result=data;
          console.log("0")
        }
        else if(req.body.status==="1")
        {
          for(let i=0;i<data.length;i++)
          {
            if(data[i].isPublish){
              result.push(data[i]);
            }
          }
        }
        else{
          for(let i=0;i<data.length;i++)
          {
            if(!data[i].isPublish){
              result.push(data[i]);
            }
          }
        }
      }
      console.log("yes")
      console.log(result)
      body.result=result;
    }catch(e){
      body.code='02';
      body.result=e.message;
    }finally{
      res.json(body);
    }
  }
}
