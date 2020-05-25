+ 说明

  + 此文档主要说明code为01的时候，result里面放的json数据，还有前端传给后端的params里面的json结构.
  + 改变问卷发布状态和删除问卷的没有包含进来，在result里面放的数据没有要交互的
  + code为02的时候，result里面放的是错误的说明，比如密码错误，用户名不存在
  + 数据库设计的命名名称从驼峰命名改成全部小写，其中问卷表的title改为papertitle，问题的title改为questiontitle

+ '/login'，用户登录

  + 前端>>后端

    ```json
    {
    username://用户名
    password://密码
    }
    ```

  + 后端>>前端

    ```json
    {
    userid://用户id
    }
    ```

+ '/register'，用户注册

  + 前端>>后端

    ```json
    {
    username://用户名
    password://密码
    }
    ```

  + 后端>>前端

    ```
    {
    
    }
    ```

+ '/get-questionnaires',根据相应条件获取问卷信息

  + 前端>>后端

    ```json
    {
    userid: "",//用户id
    //这些是条件，获取符合条件的问卷组成数组返回前端
    status: "0",//0表示全部问卷，1表示已发布的问卷，2表示未发布的问卷
    timeorder: true,//true代表正序，false代表反序
    explore: false,//true代表对questionnairename为标题的问卷进行搜索，false代表不进行搜索
    papertitle: ""//要搜索的问卷标题
    }
    ```

  + 后端<<前端

    ```json
    [//符合条件的问卷数组
    {
    paperid://问卷id
    papertitle://问卷标题
    ispublish://问卷是否发布
    createtime://创建时间
    answersheetnumber://答卷数量
    }
    ]
    ```

    

+ '/get-analysis'，返回详细作答信息以作数据分析

  + 前端>>后端

    ```json
    {
    paperid://问卷id
    }
    ```

  + 后端>>前端

    ```json
    [//返回问题数组
    {
    questionid://问题编号
    questiontitle://标题内容
    type://题目类型
    answernumber://问题作答总人数
    
    answer:[/*这里放填空题所有回答经过分词以后统计词频的结果，例如填空题只有两个人答了,一个人的回答是”厉害啊，加油吧，少年！“，另一个是”厉害啊，加油吧，少女！“
    */
    {
    name:'少年'，value:'1'
    }
    {
    name:'少女'，value:'2'   
    }
    }
    
    options:[
    {selectid://选项编号
    scontent://选项内容
    selectnumber://选项作答人数
    }
    ]
    }
    ]
    ```




+ '/get-statics'，返回问卷总体作答信息

  + 前端>>后端

    ```json
    {
    paperid://问卷id
    }
    ```

  + 后端>>前端

    ```json
    {
    ip://用户ip
    anstime://提交时间
    paperid://问卷id
    location://ip所属地区
    }
    ```

+ '/delete-answer',删除某份问卷某ip的答卷

  + 前端>>后端

    ```json
    {
    paperid://问卷id
    ip://回答问卷的ip
    }
    ```

  + 后端>>前端：无

+ '/post-new-questionnaire'，提交新创建的问卷

  + 前端>>后端

    *号标注后端不用使用的属性

    ```json
    {
        paperid:// 问卷编号
        ispublish// 是否发布
        createdtime// 创建时间
        papertitle,// 问卷标题
        questions[
            {
                *err:// 题目填写是否符合要求
                *show:// 在编辑时是表示编辑面板的显示，在数据库表示题目是否显示
                type:// 题目类型
        
                questionid:// 问题编号
                questiontitle:// 题目标题
                ismust:// 是否必答
                /* 单选题 */
                options:[
                    {
                        selectid://选项编号
                        scontent://选项内容
                        goquestion://关联关系
                    },
                    ...
                ]
                
                /* 多选题 */
                min://最大选项数
                max://最小选项数
                options:[
                    {
                        selectid://选项编号
                        scontent:// 选项内容
                    },
                    ...
                ]
            },
            ...
        ]
    }
    ```

* '/get-questionnaire-to-answer'，获取问卷信息生成问卷作答

  * 前端>>后端

    ``` json
    paperid:// 问卷编号
    ```

  * 后端>>前端

    ``` json
    {
    	"paperid": ""//问卷编号
    	"ispublish"://是否发布
    	"createtime":// 时间，例如：2020/5/25
    	"papertitle": //问卷标题
    	"questions": [{
            /* 单选题 */
    		"show": //问题是否显示，如果问题被关联，不显示
    		"questionid": //题目编号
    		"type": 0,//题目类型
    		"questiontitle": //题目标题
    		"err": false//默认值
    		"ismust": //是否必答
    		//"rela": {
    		//	"queid": null,
    		//	"optionindex": []
    		//},
    		"options": [{
    			"scontent": //选项内容
    			"goquestion": [],//关联题目编号
    			"selectid": //题目编号
    		}]
    	}, {
            /* 多选题 */
    		//"show": //问题是否显示，如果问题被关联，不显示，前端生成，后端不用
    		"questionid": //题目标题
    		"type": 1,//题目类型
    		"questiontitle": //题目内容
    		"err": false,//默认值
    		"ismust": //是否必答
    		//"rela": {
    		//	"queid": null,
    		//	"optionindex": []
    		//},
    		"min": //最少选择选项数
    		"max": //最多选择选项数
    		"options": [{
    			"scontent": //选项内容
    			"goquestion": []
    			"selectid": //选项编号
    		}, {
    			"scontent": //选项内容
    			"goquestion": []
    			"selectid": //选项编号
    		}],
    		"ans": []//默认值
    	}, {
            //"show": //问题是否显示，如果问题被关联，不显示，前端生成，后端不用
    		"questionid": //题目编号
    		"type": 2,//题目类型
    		"questiontitle": //题目内容
    		"err": false,//默认值
    		"ismust": //是否必答
    		//"rela": {
    		//	"queid": null,
    		//	"optionindex": []
    		//},
    		"scontent": //填空内容
    		"goquestion": []
    	}],
    	"ip": ""//默认值
    }
    ```

* '/post-answers'，提交作答结果

  * 前端>>后端

    

  ``` json
  {
  	"paperid": "",
  	"ispublish": 0,
  	"createtime": "2020/5/25",//创建时间
  	"papertitle": "问卷标题",
  	"questions": [{
          /* 单选题 */
  		"show": true,
  		"questionid": 1,
  		"type": 0,
  		"questiontitle": "题目",
  		"err": false,
  		"ismust": 0,
  		"rela": {
  			"queid": null,
  			"optionindex": []
  		},
  		"options": [{
  			"scontent": "选项",
  			"goquestion": [],
  			"selectid": 0
  		}],
          ans://答案，整数，选项编号
  	}, {
          /* 多选题 */
  		"show": true,
  		"questionid": 2,
  		"type": 1,
  		"questiontitle": "题目",
  		"err": false,
  		"ismust": 0,
  		"rela": {
  			"queid": null,
  			"optionindex": []
  		},
  		"min": 2,
  		"max": null,
  		"options": [{
  			"scontent": "选项",
  			"goquestion": [],
  			"selectid": 0
  		}, {
  			"scontent": "选项",
  			"goquestion": [],
  			"selectid": 1
  		}],
  		"ans": []//答案
  	}, {
          /* 填空 */
  		"show": true,
  		"questionid": 3,
  		"type": 2,
  		"questiontitle": "题目",
  		"err": false,
  		"ismust": 0,
  		"rela": {
  			"queid": null,
  			"optionindex": []
  		},
  		"scontent": "",// 填空内容（答案）
  		"goquestion": []
  	}],
  	"ip": ""
  }
  ```

* 交叉分析('/cross-over-analysis')

  * 前端>>后端

    ```json
    {
        X:[]// 自变量的问题id，长度为1或2
        Y:0// 因变量的问题id
    }
    ```

  * 后端>>前端

    ``` json
    {
        xAxis:{
            data:[
                "",// 自变量问题选项组合,不同题目选项用“/”隔开
            ]
        }
        series:[
            {
                name:"",// 因变量问题的选项内容
                data:[],// 对应组合的统计数据
            }
        ]
    }
    ```

    :ballot_box_with_check:示例

    A问题选项内容为a0，B问题选项内容为b0,b1，A，B选为自变量，

    C问题选项内容为c0,c1,c2，C选为因变量

    则：

    ``` json
    {
        xAxis:{
            data:[
                a0+"/"+b0,
                a0+"/"+b1,
            ]
        }
        series:[
            {
                name:c0,
                data:[ 
                    <A题选a0，B题选b0，c题选c0的总人数>,
                    <A题选a0，B题选b1，c题选c0的总人数>,
                ]
            },
            {
                name:c1,
                data:[ 
                    <A题选a0，B题选b0，c题选c1的总人数>,
                    <A题选a0，B题选b1，c题选c1的总人数>,
                ]
            },
            {
                name:c2,
                data:[ 
                    <A题选a0，B题选b0，c题选c2的总人数>,
                    <A题选a0，B题选b1，c题选c2的总人数>,
                ]
            },
        ]
    }
    ```

    


* '/get-questionnaire'，修改问卷

  * 前端>>后端

    ``` json
    paperid:// 问卷编号
    ```

  * 后端>>前端

    ``` json
    {
        
        questionId//目前问卷最大的问题id编号，int类型，用来在添加性题目时进行编号
        
        formData:{
            paperid//问卷id
            ispublish:false//默认值
            userid//用户id
            createtime: //创建时间
            questiontitle://问卷标题
            questions: [{
                /* 单选题 */
                show: false//默认值
                questionid://题目id
                type:0 //题目类型
                questiontitle://题目标题
                err: false,//默认值
                ismust: //是否必答
                rela: {
                    queid: //被关联的问题id
                    optionindex: //被关联问题的选项id
                },
                options: [{
                    scontent: //选项内容
                    goquestion: []//默认值
                }]
            }, {
                /* 多选题 */
                show: false,//默认值
                questionid//题目id
                type:1,//题目类型
                questiontitle//题目标题
                err: false//默认值
                ismust//是否必答
                rela: {
                    queid: //被关联的问题id
                    optionindex: []//被关联问题的选项id
                },
                min: //最少选择数
                max: //最多选择数
                options: [{
                    scontent//选项内容
                }]
            }, {
                /* 填空题 */
                show: false,//默认值
                questionid//问题id
                type:2,//问题类型
                questiontitle//问题标题
                err: false,//默认值
                ismust//是否必填
                rela: {
                    queid: //被关联的问题id
                    optionindex: []//被关联问题的选项id
                },
                scontent: ""//默认值
            }]
        }
    }
    ```

    :ballot_box_with_check:示例:

    rela容易和goquestion混淆，下面对rela属性进行示例。rela与goquestion同样起到标记关联关系的作用，只是他们设置的对象不一样。

    [questionid=1]   1.问题一[单选]：A.[selectid=1] B.[selectid=2] C.[selectid=3]

    [questionid=2]   2.问题二[任何类型的题目]  

    * 逻辑设置为：当选择**问题一**的B、C选项时，显示问题二。

    * 对于**问题2**，它的rela设置为：

    ``` json
    rela: {
                queid: 2//被关联的问题id
                optionindex: [2,3]//被关联问题的选项id
            },
    ```

    
