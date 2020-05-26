//分词部分使用盘古分词
//https://github.com/leizongmin/node-segment/tree/greenkeeper/initial
const _model=require('../../models/action');
const answer=require('../../models/index').answer;//answer
const options=require('../../models/index').options;//option
const answersheet=require('../../models/index').answersheet;//answer-sheet
const question=require('../../models').question;//question
var Segment = require('segment');// 载入模块,npm install segment

module.exports = {
  crossOverAnalysis: async function(req,res){
    var body={code:'01',result:''};
    var mapycondition = {
      attributes:['scontent'],
      where: {
        questionid: req.body.Y
      }
    };

    try {
      var x = req.body.X;
      var mapxacondition = {
        attributes: ['scontent'],
        where: {
          questionid: x[0]
        }
      };
      //得到公用的a c的选项内容
      var data_a = await _model.findAll(findopSequelize, mapxacondition);//a-scontent
      var data_c = await _model.findAll(findopSequelize, mapycondition);//c-scontent

      var a = [];
      var c = [];
      for (let j = 0; j < data_a.length; j++) {
        var conditiona = {
          attributes: ['selectid'],
          where: {
            scontent: data_a[j]
          }
        };
        var innera = await _model.findAll(findopSequelize, conditiona);
        a.push(innera);
      }//a-selectid
      for (let j = 0; j < data_c.length; j++) {
        var conditionc = {
          attributes: ['selectid'],
          where: {
            scontent: data_c[j]
          }
        };
        var innerc = await _model.findAll(findopSequelize, conditionc);
        c.push(innerc);
      }//c-selectid

      //自变量只有一个
      if (x.length < 2) {
        var bodyx = {xAxis: '', series: ''};
        bodyx.xAxis = data_a;
        var seriesx = [];
        for (let i = 0; i < data_c.length; i++) {
          var innerxbody = {name: '', data: ''};
          innerxbody.name = data_c[i].scontent;
          var n=[];

          var condition2 = {
            attributes: ['ip'],
            where: {
              selectid: c[i].selectid
            }
          };
          var cip = await _model.findAll(findansSequelize, condition2);//得到选C问题c[i]选项的ip组

          for (let j = 0; j < a.length; j++) {
            let num = 0;
            var condition1 = {
              attributes: ['ip'],
              where: {
                selectid: a[j].selectid
              }
            };
            var aip = await _model.findAll(findansSequelize, condition1);//得到选A问题a[j]选项的ip组

            //比较ip
            for (let ii = 0; ii < aip.length; ii++)
            {
              for (let jj = 0; jj < cip.length; jj++) {
                if (aip[ii].ip == cip[jj].ip) {
                  num++;
                }
              }
            }
            n.push(num);
          }
          innerxbody.data=n;

          seriesx.push(innerxbody);

        }
        bodyx.series=seriesx;
        body.result=bodyx;
      }
      else{
        var mapxbcondition = {
          attributes: ['scontent'],
          where: {
            questionid: x[1]
          }
        };
        //得到公用的a c的选项内容
        var data_b = await _model.findAll(findopSequelize, mapxbcondition);//b-scontent
        var b = [];
        for (let j = 0; j < data_b.length; j++) {
          var conditionb = {
            attributes: ['selectid'],
            where: {
              scontent: data_b[j]
            }
          };
          var innerb = await _model.findAll(findopSequelize, conditionb);
          b.push(innerb);
        }//b-selectid

        var bodyab= {xAxis: '', series: ''};
        var innerxAxis=[];
        for(let i=0;i<data_a.length;i++)
        {
          for(let j=0;j<data_b.length;j++)
          {
            let str=data_a[i]+"/"+data_b[j];
            innerxAxis.push(str);
          }
        }
        bodyab.xAxis=innerxAxis;

        var seriesab=[];
        for(let i = 0; i < data_c.length; i++)
        {
          var innerabbody = {name: '', data: ''};
          innerabbody.name = data_c[i].scontent;//c0 c1.....
          var nn=[];
          var condition22 = {
            attributes: ['ip'],
            where: {
              selectid: c[i]
            }
          };
          var Cip = await _model.findAll(findansSequelize, condition22);//得到选C问题c[i]选项的ip组

          for (let j = 0; j < a.length; j++) {
            let num = 0;
            var condition11 = {
              attributes: ['ip'],
              where: {
                selectid: a[j]
              }
            };
            var Aip = await _model.findAll(findansSequelize, condition11);//得到选A问题a[j]选项的ip组
            for(let k=0;k<b.length;b++)
            {
              var condition33 = {
                attributes: ['ip'],
                where: {
                  selectid: b[k]
                }
              };
              var Bip = await _model.findAll(findansSequelize, condition33);//得到选B问题b[k]选项的ip组

              for (let ii = 0; ii < Aip.length; ii++)
              {
                for (let jj = 0; jj < Bip.length; jj++) {
                  for (let kk = 0; kk < Cip.length; kk++) {

                    if ((Aip[ii].ip == Bip[jj].ip)&&(Bip[jj].ip==Cip[kk])) {
                      num++;
                    }
                  }
                }
              }
              nn.push(num);
            }
          }
          innerabbody.data=nn;
          seriesab.push(innerabbody);
        }
        bodyab.series=seriesab;
        body.result=bodyab;
      }
    }
    catch (e) {
      body.code='02';
      body.result=e.message;
    }
    finally {
      res.json(body);
    }
  },
  getStatics: async function(req,res){
    var body={code:'01',result:''};
    var condition = {
      attributes:['ip','anstime'],
      where: {
        paperid: req.body.paperid
      }
    };
    try{
      var data = await _model.findAll(answersheet, condition);
      var result=[];
      for(let i=0;i<data.length;i++) {
        result.push(data[i]);
      }
      body.result=result;
    }
    catch (e) {
      body.code='02';
      body.result=e.message;
    }
    finally {
      res.json(body);
    }
  },
  deleteAnswer: async function(req,res){
    var body={code:'01',result:''};
    var condition = {
      where: {
        ip: req.body.ip,
        paperid:req.body.paperid
      }
    };
    try{
      await _model.deleteAll(answer, condition);//删的是answer,和git上那个重复的话删除这行
      await _model.deleteAll(answersheet, condition);//删的是answer-sheet
    }
    catch (e) {
      body.code='02';
      body.result=e.message;
    }
    finally {
      res.json(body);
    }
  },
  getAnalysis: async function(req,res){
    var body={code:'01',result:''};
    var segment = new Segment();// 创建实例
    segment.useDefault();// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
    var ids=req.body.paperid;
    //查问题表得前三attributes
    var questioncondition = {
      attributes:['questionid','questiontitle','type'],
      where: {
        paperid: ids
      }
    };

    try{
      var result=[];
      var data = await _model.findAll(question, questioncondition);
      //data查询问卷的问题，必答，题目类型
      for (let i=0;i<data.length;i++)
      {
        //构建body，初始写入
        var innerbody={questionid:'',questiontitle:'',type:'',answernumber:'',answers:'',options:'',tableStatus:"true",wordStatus:"false",pieStatus:"false",barStatus:"false"};
        innerbody.questionid=data[i].questionid;
        innerbody.questiontitle=data[i].questiontitle;
        innerbody.type=data[i].type;

        //用data中的questionid对应出单题作答人数
        var anscondition={
          attributes:['ip'],
          where:{
            paperid:ids,
            questionid:data[i].questionid
          }
        };
        var ansnum = await _model.findAndCountAll(answer,anscondition);
        innerbody.answernumber=ansnum.count;

        //是填空就answer不是就options
        //把{问题id、标题、种类、回答人数}当作整体后的操作，即单独考虑ans[]和op[]
        if(data[i].type==2)
        {
          innerbody.options="";//options写入空
          var ans=[];
          var anscondition1={
            attributes:['answer'],
            where:{
              paperid:ids,
              questionid:data[i].questionid
            }
          };
          var allanswer=await _model.findAll(answer,anscondition1);
          var str="";
          for(let a=0;a<allanswer.length;a++){
            str=str+allanswer[a].answer;
          }
          //分词，格式如[ '这是', '一个',  '中文', '分词', '模块', '。' ]
          var cutting = segment.doSegment(str, {
            simple: true
          });

          //建立映射表，统计词频
          var map={};
          for(let b=0;b<cutting.length;b++)
          {
            var strWord =cutting[b];
            if(!map[strWord])
              map[strWord]=1;
            else
              map[strWord]++;
          }
          for(var word in map)
          {
            var an={name:'',value:''};
            an.name=word;
            an.value=map[word];
            ans.push(an);
          }
          innerbody.answers=ans;
        }
        else {
          innerbody.answer="";//answer写入空
          var selectcondition = {
            attributes: ['selectid', 'scontent'],
            where: {
              paperid:ids,
              questionid:data[i].questionid
            }
          };
          var dataoption = await _model.findAll(options, selectcondition);

          //{问题id、标题、种类、回答人数}下的选项作答人数
          var innerresult=[];
          for (let j = 0; j < dataoption.length; j++) {
            var innerjbody={selectid:'',scontent:'',selectnumber:''};
            var contentcondition = {
              attributes: ['ip'],
              where: {
                paperid:ids,
                questionid: data[i].questionid,
                selectid: dataoption[j].selectid
              }
            };
            var selectnum = await _model.findAndCountAll(answer, contentcondition);
            innerjbody.selectid=dataoption[j].selectid;
            innerjbody.scontent=dataoption[j].scontent;
            innerjbody.selectnumber=selectnum.count;
            innerresult.push(innerjbody);
          }

          innerbody.options=innerresult;
        }
        result.push(innerbody);
      }
      body.result=result;
    }
    catch (e) {
      body.code='02';
      body.result=e.message;
    }
    finally {
      res.json(body);
    }
  },
  postAnswers: async function(req,res){
    var body={code:'01',result:'success'};
    try{
      //总表读数据
      var asbody={paperid:'',ip:'',anstime:''};
      asbody.paperid=req.body.paperid;
      asbody.ip=req.body.ip;
      asbody.anstime=req.body.anstime;
      var result1=await _model.create(postasSequelize,asbody);

      var qes=req.body.questions;
      for(let i=0;i<qes.length;i++)
      {
        let ansbody={paperid:'',questionid:'',ip:'',selectid:'',answer:''};
        ansbody.paperid=req.body.paperid;
        ansbody.questionid=qes[i].questionid;
        ansbody.ip=req.body.ip;
        //填空
        if(qes[i].topicid=2)
        {
          ansbody.selectid=0;//填空selectid为0
          ansbody.answer=qes[i].answer;
          var resultF=await _model.create(postansSequelize,ansbody);
        }
        //选择
        else
        {
          ansbody.selectid=qes[i].answer;
          ansbody.answer="";
          var resultS=await _model.create(postansSequelize,ansbody);
        }
      }
    }
    catch (e) {
      body.code = '02';
      body.result = e.message;
    }
    finally {
      res.json(body);
    }
  }
}
