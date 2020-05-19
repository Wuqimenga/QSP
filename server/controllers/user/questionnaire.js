const userSequelize=require('../../models/index').control_user;
const questionnaires = require('../models').questionnaires;
const question = require('../models').question;
const option = require('../models').option;
const answer=require('../models').answer;
const op=

module.exports = {
    get_questionnaires:async function (req, res) {
    var body={code:'01',result:''};
    var condition={
        attributes:['paperid','papertitle','ispublish','creamtime'],
        where :{
            userid:req.body.userid,
            questionnairestitle:req.body.questionnairestitle
        }
    };
    try {
    var result=[];
    var data = await _model.findAll(questionnaires, condition);
        for (let i=0;i<data.length;i++)
        {
            var body2={paperid:'',papertitle:'',ispublish:'',creaetime:'',answersheetnumber:''};
            body2.paperid=data.paperid;
            body2.papertitle=data.papertitle;
            body2.ispublish=data.ispublish;
            body2.creaetime=data.creaetime;
            var con={
                where :{
                    paperid:data.paperid
                }
            }
            var data2=await _model.findAndCountAll(answer, con);
            body2.answersheetnumber=data2.count;
            result.push(body2);
        }
       
        if (req.body.timeorder==true){
            result.sort(function (a, b) {
                if (a.creaetime < b.creaetime) {
                    return 1;
                } else if (a.creaetime == b.creaetime) {
                    return 0;
                } else {
                    return -1;
                }
            });
        }
        else {
            body.sort(function (a, b) {
                if (a.creaetime < b.creaetime) {
                    return -1;
                } else if (a.creaetime == b.creaetime) {
                    return 0;
                } else {
                    return 1;
                }
            });
        }
        body.result=result;
    }
    catch(e){
        body.code='02';
        body.message=e.message;
    }
    finally{
        res.json(body);
    }
    },

    change_status:async function (req, res){
        var body={code:'01',result:'success'};
        var id=req.body.paperid;
        try{
            var condition={
                where :{
                    paperid: req.body.paperid
                }
            };
            var data = await _model.findOne(questionnaires, condition);
            if (data.ispublish){
                data.ispublish=false;
            }
            else {
                data.ispublish=true;
            }
        }
        catch(e){
            body.code='02';
            body.result=e.message;
        }
        finally{
            res.json(body);
        }
    },

    delete_questionnaires:async function (req, res){
        var body={code:'01',result:'success'};
        try{
            var condition={
                where :{
                    paperid: req.body.paperid
                }
            };
            await _model.deleteAll(answer, condition);
            await _model.deleteAll(questionnaires, condition);
        }
        catch(e){
            body.code='02';
            body.message=e.message;
        }
        finally{
            res.json(body);
        }
    },

    post_new_questionnaire:async function (req, res){
        var body={code:'01',result:'success'};
        try{
        var newquestionnaire={paperid:'',questiontitle:'',ispublish:'',userid:'',creaetime:''};
        newquestionnaire.paperid=req.body.paperid;
        newquestionnaire.questiontitle=req.body.questiontitle;
        newquestionnaire.ispublish=req.body.ispublish;
        newquestionnaire.creaetime=req.body.creaetime;//这个在数据生成的时候会自动生成的吧
        newquestionnaire.userid=req.body.userid;//这个应该是必须的。
        var data1=await _model.create(questionnaires, newquestionnaire);
        var ques=req.body.questions;
        for (let i=0;i<ques.length;i++)
        {
            var que={paperid:'',questionid:'',questiontitle:'',topicid:'',ismust:'',min:'',max:''};
            que.questionid=ques[i].questionid;
            que.questiontitle=ques[i].questiontitle;
            que.ismust=ques[i].ismust;
            que.paperid=data1.paperid;
            if (ques.type==1) {
                que.max=ques.max;
                que.min=ques.min;
            }
            var data2=await _model.create(question, ques);
            var op=ques.options;
            for (let j=0;j<op.length();j++){
                var data3=await _model.create(option, op[j]);
            }
        }
        }
        catch(e){
            body.code='02';
            body.message=e.message;
        }
        finally{
            res.json(body);
        }
    }, 

    
    get_questionnaire_to_answer:async function (req, res){
        var body={code:'01',result:''};
        try{
        questionnaire.belongsTo(question);
        question.belongsTo(options);
        question.hasMany(questionnaire);
        options.hasMany(question);
        var condition={
            include:[{
                where:{
                    paperid:req.body.paperid
                },
                model:question,
                include:[{
                   model:options
                }]
            }]
        }
        var data = await _model.findAll(questionnaire, condition);
        body.result=data;
        }
        catch(e){
            body.code='02';
            body.message=e.message;
        }
        finally{
            res.json(body);
        }
    },

    search_questionnaire:async function (req, res){  
        var body={code:'01',result:''};
        try{
            var data = await _model.findByname(questionnaire, req.body.papertitle);
            body.result=data;
        }
        catch(e){
            body.code='02';
            body.message=e.message;
        }
        finally{
            res.json(body);
        }
    }
}
