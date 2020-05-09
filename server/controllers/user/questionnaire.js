const userSequelize=require('../../models/index').control_user;
const questionnaires = require('../models').questionnaires;
const question = require('../models').question;
const option = require('../models').option;
const express = require('express');
const router = express.Router();

module.exports = {
    get-questionnaires: async function (req, res, next) {
    var re={};
    if (req.body.explore){
    questionnaire.findAll({
        include:[{
           where: {
               userid: req.body.name,
               questiontitle: req.body.questionnairename
           }
           }]
    })}
    else {
    questionnaire.findAll({
            include:[{
               model:questionnaire,
               where: {
                   userid: req.body.name
               }
               }]
    })
    }.then(function(data)){
        if (data.length){
            if (req.body.status=='1')
            data.findAll{
                where {
                    data.ispublish:true
                }
            }
            if (req.body.status=='2')
                        data.findAll{
                            where {
                                data.ispublish:false
                            }
                        }
            if (timeorder){
            data.findAll({
                'order': "createtime DESC"
            });
            }
            else {
                data.findAll({
                                'order': "~createtime DESC"
                            });
            }
           // var t={paperid:'',papertitle:'',ispublish:''};
            for (let i=0;i<data.length;i++)
            {
                answer-sheet.findAndCountAll({
                    while :{paperid:data[i].paperid }
                })
                .then(result=>{
                data[i]+="answersheetnumber:"+result.count+',';
                })
            }
            res.json(data);
        }else {
        }
    }).catch(function(err){
              console.log('err'+ err);
          });
    }

    change-status:async function (req, res, next){
        var id=req.body.paperid;
        User.update({ispublish:!ispublish}, {where: {paperid: id}})
    }

    post-questionnaire:async function (req, res, next){
        var newquestionnaire={paperid:'',questiontitle:'',ispublish:'',userid:'',creaetime:''};
        newquestionnaire.paperid=req.body.paperid;
        newquestionnaire.questiontitle=req.body.questiontitle;
        newquestionnaire.ispublish=req.body.ispublish;
        newquestionnaire.userid=req.body.userid;
        models.questionnaires.create(newquestionnaire) .then(function (msg) {
            var shang=msg.userid;
        }
        var ques=req.body.questions;
        for (let i=0;i<ques.length;i++)
        {
            var que={paperid:'',questionid:'',questiontitle:'',topicid:'',ismust:'',min:'',max:''};
            que.questionid=ques[i].questionid;
            que.questiontitle=ques[i].questiontitle;
            que.ismust=ques[i].ismust;
            que.paperid=shang;
            if (ques.type==1) {
                que.max=ques.max;
                que.min=ques.min;
            }
            models.question.create(newquestionnaire);
            var op=ques.options;
            for (let j=0;j<op.length();j++){
                models.options.create(op[j]);
            }
        }
    }

    questionnaire.belongsTo(question)
    question.belongsTo(options)
    question.hasMany(questionnaire)
    options.hasMany(question)
    get-questionnaire-to-answer:async function (req, res, next){
        questionnaire.findAll({
            include:[{
                where:{
                    paperid:req.body.paperid
                }
                model:question,include:[{
                model:options
                }]
            }]
        }).then(function(questionnaire)){
            res.json(questionnaire);
        }
    }
}
