
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
    var result=[
      {
        questionid: "1",
        questiontitle: "请问你是大几",
        topicid: "0", //0为单选题,1为多选题,2为填空题
        answernumber: "100",
        answers: [],
        sumtext: "本题合计有效人次",
        tableStatus: true,
        barStatus: false,
        pieStatus: false,
        options: [
          {
            selectid: "1",
            scontent: "大一",
            selectnumber: "30"
          },
          {
            selectid: "2",
            scontent: "大二",
            selectnumber: "20"
          },
          {
            selectid: "3",
            scontent: "大二",
            selectnumber: "30"
          },
          {
            selectid: "4",
            scontent: "大三",
            selectnumber: "20"
          }
        ]
      },
      {
        questionid: "2",
        questiontitle: "请问你喜欢哪一种球类",
        topicid: "1", //0为单选题,1为多选题,2为填空题
        answernumber: "100",
        sumtext: "本题合计有效人次",
        answers: [],
        tableStatus: true,
        barStatus: false,
        pieStatus: false,
        options: [
          {
            selectid: "1",
            scontent: "羽毛球",
            selectnumber: "40"
          },
          {
            selectid: "2",
            scontent: "篮球",
            selectnumber: "40"
          },
          {
            selectid: "3",
            scontent: "足球",
            selectnumber: "40"
          },
          {
            selectid: "4",
            scontent: "乒乓球",
            selectnumber: "70"
          }
        ]
      },
      {
        questionid: "3",
        questiontitle: "请问你有什么建议吗？",
        topicid: "2", //0为单选题,1为多选题,2为填空题
        answernumber: "100",
        wordStatus: false,
        barStatus: false,
        pieStatus: false,
        answers: [
          {
            name: "很好",
            value: "20"
          },
          {
            name: "厉害",
            value: "30"
          },
          {
            name: "不好",
            value: "2"
          },
          {
            name: "还行",
            value: "10"
          },
          {
            name: "挺差的",
            value: "1"
          },
          {
            name: "非常差",
            value: "3"
          }
        ],
        options: []
      }
    ]
    try{

    }catch(e){
      body.code='02';
      body.result=e.message;
    }finally{
      res.json(body);
    }
  }
}
