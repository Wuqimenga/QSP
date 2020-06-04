const questionnaire = require("../../models/index").questionnaire;
const question = require("../../models/index").question;
const options = require("../../models/index").options;
const answer = require("../../models/index").answer;
const answersheet = require("../../models/index").answersheet;
const _model = require("../../models/action");
var Sequelize = require("sequelize");
module.exports = {
  getQuestionnaires: async function(req, res) {
    var body = { code: "01", result: "" };
    try {
      var result = [];
      var condition = {};
      if (req.body.explore == "true") {
        condition = {
          attributes: ["paperid", "papertitle", "ispublish", "createtime"],
          where: {
            userid: req.body.userid,
            papertitle: {
              [Sequelize.Op.like]: `%${req.body.papertitle}%`
            }
          }
        };
      } else {
        condition = {
          attributes: ["paperid", "papertitle", "ispublish", "createtime"],
          where: {
            userid: req.body.userid
          }
        };
      }
      var data = await _model.findAll(questionnaire, condition);
      for (let i = 0; i < data.length; i++) {
        var body2 = {
          paperid: "",
          papertitle: "",
          ispublish: "",
          createtime: "",
          answersheetnumber: ""
        };
        body2.paperid = data[i].paperid;
        body2.papertitle = data[i].papertitle;
        body2.ispublish = data[i].ispublish;
        body2.createtime = data[i].createtime;
        var con = {
          where: {
            paperid: data[i].paperid
          }
        };
        var data2 = await _model.findAndCountAll(answersheet, con);
        body2.answersheetnumber = data2.count;
        result.push(body2);
      }
      if (req.body.status == "1") {
        result.forEach((item, index) => {
          if (item.ispublish == false) {
            delete result[index];
          }
        });
        result = result.filter(function(val) {
          return val;
        });
      } else if (req.body.status == "2") {
        result.forEach((item, index) => {
          if (item.ispublish == true) {
            delete result[index];
          }
        });
        result = result.filter(function(val) {
          return val;
        });
      }

      if (req.body.timeorder == "true") {
        result.sort(function(a, b) {
          if (a.createtime < b.createtime) {
            return 1;
          } else if (a.createtime == b.createtime) {
            return 0;
          } else {
            return -1;
          }
        });
      } else {
        result.sort(function(a, b) {
          if (a.createtime < b.createtime) {
            return -1;
          } else if (a.createtime == b.createtime) {
            return 0;
          } else {
            return 1;
          }
        });
      }
      body.result = result;
    } catch (e) {
      body.code = "02";
      body.message = e.message;
    } finally {
      res.json(body);
    }
  },

  changeStatus: async function(req, res) {
    var body = { code: "01", result: "" };
    try {
      var condition = {
        where: {
          paperid: req.body.paperid
        }
      };
      var data = await _model.findOne(questionnaire, condition);
      console.log(req.body.paperid);
      await _model.update(
        questionnaire,
        { ispublish: !data.ispublish },
        condition
      );
    } catch (e) {
      body.code = "02";
      body.result = e.message;
    } finally {
      res.json(body);
    }
  },

  deleteQuestionnaires: async function(req, res) {
    var body = { code: "01", result: "" };
    try {
      var condition = {
        where: {
          paperid: req.body.paperid
        }
      };
      await _model.deleteAll(answer, condition);
      await _model.deleteAll(answersheet, condition);
      await _model.deleteAll(questionnaire, condition);
      await _model.deleteAll(options, condition);
    } catch (e) {
      body.code = "02";
      body.message = e.message;
    } finally {
      res.json(body);
    }
  },

  postNewQuestionnaire: async function(req, res) {
    var body = { code: "01", result: "" };

    try {
      var newquestionnaire = {
        papertitle: "",
        ispublish: "",
        userid: "",
        createtime: ""
      };
      newquestionnaire.papertitle = req.body.papertitle;
      newquestionnaire.ispublish = req.body.ispublish;
      newquestionnaire.createtime = req.body.createtime; //这个在数据生成的时候会自动生成的吧
      newquestionnaire.userid = req.body.userid; //这个应该是必须的。
      var data = await _model.create(questionnaire, newquestionnaire);
      var ques = req.body.questions;
      for (let i = 0; i < ques.length; i++) {
        var que = {
          paperid: 0,
          questionid: 0,
          questiontitle: "",
          type: 0,
          ismust: 0,
          min: 0,
          max: 0
        };
        que.questionid = ques[i].questionid;
        que.questiontitle = ques[i].questiontitle;
        que.ismust = ques[i].ismust;
        que.paperid = data.dataValues.paperid;
        que.type = ques[i].type;
        if (ques[i].type == "1") {
          que.max = ques[i].max;
          que.min = ques[i].min;
        }
        await _model.create(question, que);
        for (let j = 0; j < ques[i].options.length; j++) {
          let op = {
            paperid: data.dataValues.paperid,
            questionid: ques[i].questionid,
            selectid: ques[i].options[j].selectid,
            scontent: ques[i].options[j].scontent,
            goquestion: ""
          };
          if (ques[i].options[j].goquestion.length > 0) {
            var tempgo = "";
            for (let z = 0; z < ques[i].options[j].goquestion.length; z++) {
              tempgo = tempgo + ques[i].options[j].goquestion[z] + "/";
            }
            op.goquestion = tempgo;
          }
          await _model.create(options, op);
        }
      }
    } catch (e) {
      body.code = "02";
      body.message = e.message;
    } finally {
      res.json(body);
    }
  },

  getQuestionnaireToAnswer: async function(req, res) {
    var body = { code: "01", result: "" };
    try {
      var con1 = {
        attributes: ["papertitle", "ispublish", "createtime"],
        where: {
          paperid: req.body.paperid
        }
      };
      var res1 = await _model.findOne(questionnaire,con1);
      var data = {
        paperid: req.body.paperid,
        papertitle: res1.papertitle,
        ispublish: res1.ispublish,
        createtime: res1.createtime,
        questions: []
      };
      if(!res1.ispublish)
      {
        body.code="02",
        body.result="问卷未发布"
      }
      else{
      var con2 = {
        attributes: [
          "questionid",
          "questiontitle",
          "type",
          "ismust",
          "min",
          "max"
        ],
        where: {
          paperid: req.body.paperid
        }
      };
      var res2 = await _model.findAll(question,con2);
      for (let i = 0; i < res2.length; i++) {
        let que = {
          questionid: res2[i].questionid,
          questiontitle: res2[i].questiontitle,
          type: res2[i].type,
          ismust: res2[i].ismust,
          min: 0,
          max: 0,
          options: []
        };
        if (type <= 1) {
          let con3 = {
            attributes: ["selectid", "scontent", "goquestion"],
            where: {
              paperid: req.body.paperid,
              questionid: res2[i].questionid
            }
          };

          let res3 = await _model.findAll(options,con3);
          for(let j=0;j<res3.length;j++){
            if(res3[j].goquestion!="")
            {
              res3[j].goquestion=res3[j].goquestion.split("/");
            }
          }
          que.options = res3;
        }
        if (type == 1) {
          que.min = res2[i].min;
          que.max = res2[i].max;
        }
        data.questions.push(que);
      }
      body.result = data;
    }
    } catch (e) {
      body.code = "02";
      body.message = e.message;
    } finally {
      res.json(body);
    }
  }
};
