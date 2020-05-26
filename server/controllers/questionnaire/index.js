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
      console.log(req.body.papertitle);
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
        var data2 = await _model.findAndCountAll(answer, con);
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
      if (req.body.ispublish == "false") {
        newquestionnaire.ispublish = 0;
      } else {
        newquestionnaire.ispublish = 1;
      }
      console.log(req.body);
      newquestionnaire.createtime = req.body.createtime; //这个在数据生成的时候会自动生成的吧
      newquestionnaire.userid = req.body.userid; //这个应该是必须的。
      var data = await _model.create(questionnaire, newquestionnaire);
      var ques = req.body.questions;
      for (let i = 0; i < ques.length; i++) {
        var que = {
          paperid: "",
          questionid: "",
          papertitle: "",
          type: "",
          ismust: "",
          min: "",
          max: ""
        };
        que.questionid = ques[i].questionid;
        que.questiontitle = ques[i].papertitle;
        que.ismust = ques[i].ismust;
        que.paperid = data1.paperid;
        que.type = ques[i].topicid;
        if (ques.topicid == "1") {
          que.max = ques.max;
          que.min = ques.min;
        }
        await _model.create(question, que);
        for (let j = 0; j < ques.options.length(); j++) {
          let op = {
            paperid: data1.paperid,
            questionid: ques[i].questionid,
            selectid: ques.options[j].selectid,
            scontent: ques.options[j].scontent,
            goquestion: ques.options[j].goquestion
          };
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
      questionnaire.belongsTo(question);
      question.belongsTo(options);
      question.hasMany(questionnaire);
      options.hasMany(question);
      var condition = {
        include: [
          {
            where: {
              paperid: req.body.paperid
            },
            model: question,
            include: [
              {
                model: options
              }
            ]
          }
        ]
      };
      var data = await _model.findAll(questionnaire, condition);
      body.result = data;
    } catch (e) {
      body.code = "02";
      body.message = e.message;
    } finally {
      res.json(body);
    }
  }
};
