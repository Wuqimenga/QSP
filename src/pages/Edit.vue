<template>
  <div>
    <vheader content="编辑" :backRouter="this.$router" />
    <div class="center-plane">
      <h3>formData:</h3>
      {{formData}}
      <el-form ref="rulesForm1" :rules="rules" :model="formData">
        <div class="edit-head-menu">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <p class="title">{{formData.papertitle}}</p>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <button class="edit-btn" @click="editVisible = true">
                <i class="el-icon-edit-outline" style="font-size:25px"></i>
                <br />编辑标题
              </button>
              <!-- 问卷标题编辑浮窗 -->
              <el-dialog
                :before-close="editDialogClose"
                title="提示"
                :visible.sync="editVisible"
                width="70%"
              >
                <!-- <el-form-item prop="templeTitle"> -->
                <el-input
                  show-word-limit
                  maxlength="51"
                  type="textarea"
                  v-model="templeTitle"
                  placeholder="请填写问卷标题"
                />
                <p style="color:red" v-if="templeTitle==''">问卷标题不能为空</p>
                <!-- </el-form-item> -->
                <span slot="footer" class="dialog-footer">
                  <el-button @click="editVisible = false;templeTitle=formData.papertitle;">取 消</el-button>
                  <el-button type="primary" @click="editBtn()">确 定</el-button>
                </span>
              </el-dialog>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-button class="fill" type="primary" plain @click="toPreview()">预览</el-button>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-button class="fill" type="primary" @click="onSubmit(formData)">保存问卷</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-button
                @click="add_question(0)"
                :disabled="formData.questions.length>=30"
                class="fill"
              >添加单选</el-button>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-button
                @click="add_question(1)"
                :disabled="formData.questions.length >=30"
                class="fill"
              >添加多选</el-button>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-button
                @click="add_question(2)"
                :disabled="formData.questions.length>=30"
                class="fill"
              >添加填空</el-button>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col>
            <div v-for="(question,i_q) in formData.questions" :key="i_q" style="padding: 10px 0;">
              <!-- 题目面板 -->
              <el-card shadow="hover">
                <p>
                  <span style="color:red;">{{question.ismust==1?"*":""}}</span>
                  {{i_q+1}} .
                  {{question.questiontitle}}
                  <span
                    style="color:gray;"
                  >[{{question.type==0?"单选题":(question.type==1?"多选题":"填空题")}}]</span>
                </p>
                <div v-for="(option,i_o) in question.options" :key="i_o">
                  <el-radio :label="option.scontent"></el-radio>
                </div>

                <!-- 这只是个没有用的输入框，用来演示的 -->
                <div v-if="question.type==2">
                  <el-form-item>
                    <el-input :disabled="true" placeholder="填空内容" />
                  </el-form-item>
                </div>
                <div>
                  <a @click="question_moveLast(i_q)" class="left-float">最后</a>
                  <a @click="question_moveFirst(i_q)" class="left-float">最前</a>
                  <a @click="question_moveDown(i_q)" class="left-float">下移</a>
                  <a @click="question_moveUp(i_q)" class="left-float">上移</a>
                  <a @click="del_question(i_q)" class="left-float">删除</a>
                  <a @click="show_edit_panel(i_q)" class="left-float">{{question.show?"隐藏":"编辑"}}</a>
                </div>
              </el-card>

              <!-- 编辑面板 -->
              <div v-if="question.show">
                <el-card shadow="hover">
                  <el-row :gutter="30">
                    <el-col :xs="6" :sm="3" :md="3" :lg="3" :xl="3">
                      <div class="small-title">标题</div>
                    </el-col>
                    <el-col :xs="18" :sm="12" :md="12" :lg="12" :xl="12">
                      <el-form-item
                        :prop='"questions."+i_q+".questiontitle"'
                        :rules="rules.question_title"
                      >
                        <el-input v-model="question.questiontitle" placeholder="请填写题目" />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="9" :md="9" :lg="9" :xl="9">
                      <el-switch
                        active-value="1"
                        inactive-value="0"
                        active-text="必答"
                        v-model="question.ismust"
                      ></el-switch>
                    </el-col>
                  </el-row>
                  <div v-for="(option,i_o) in question.options" :key="i_o">
                    <el-row :gutter="30">
                      <el-col :xs="4" :sm="3" :md="3" :lg="3" :xl="3">
                        <div class="small-title">选项</div>
                      </el-col>
                      <el-col :xs="20" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item :prop='"questions."+i_q+".options."+i_o+".scontent"'>
                          <el-input v-model="option.scontent" placeholder="请填写选项内容" />
                        </el-form-item>
                      </el-col>
                      <el-col :xs="{push:4,span:20}" :sm="9" :md="9" :lg="9" :xl="9">
                        <el-button
                          @click="add_option(i_q,i_o)"
                          :disabled="question.options.length>=15"
                          type="primary"
                          size="small"
                          icon="el-icon-plus"
                          circle
                        ></el-button>

                        <el-button
                          @click="del_option(i_q,i_o)"
                          :disabled="((question.type==0&&question.options.length<2)
                                    ||(question.type==1&&question.options.length<=2))?true:false"
                          type="primary"
                          size="small"
                          icon="el-icon-minus"
                          circle
                        ></el-button>

                        <el-button
                          @click="option_moveUp(i_q,i_o)"
                          type="primary"
                          size="small"
                          icon="el-icon-arrow-up"
                          circle
                        ></el-button>

                        <el-button
                          @click="option_moveDown(i_q,i_o)"
                          type="primary"
                          size="small"
                          icon="el-icon-arrow-down"
                          circle
                        ></el-button>
                      </el-col>
                    </el-row>
                  </div>

                  <!-- 多选题显示编辑限制选项个数组件 -->
                  <div v-if="question.type==1">
                    <el-row>
                      <el-col :xs="7" :sm="4" :md="4" :lg="4" :xl="4">
                        <div class="small-title">最少选项</div>
                      </el-col>
                      <el-col :xs="17" :sm="8" :md="8" :lg="8" :xl="8">
                        <el-input-number
                          v-model="question.min"
                          :min="1"
                          :max="question.options.length"
                        ></el-input-number>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :xs="7" :sm="4" :md="4" :lg="4" :xl="4">
                        <div class="small-title">最多选项</div>
                      </el-col>
                      <el-col :xs="17" :sm="8" :md="8" :lg="8" :xl="8">
                        <el-input-number
                          v-model="question.max"
                          :value="question.min"
                          :min="2"
                          :max="question.options.length"
                        ></el-input-number>
                      </el-col>
                    </el-row>
                  </div>

                  <a @click="show_logic_dialog(i_q)">逻辑设置</a>
                  <!-- 逻辑设置弹窗 -->
                  <el-dialog title="逻辑设置" :visible.sync="dialogVisible" center>
                    <div class="center-plane">
                      <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                          <div class="small-title">当前题目:</div>
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                          <div class="small-title">{{question.questiontitle}}</div>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                          <div class="small-title">关联题目:</div>
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                          <el-select v-model="question.rela.queid" placeholder="请选择">
                            <el-option
                              v-for="(rq,ri) in getRelatedQuestions(i_q)"
                              :key="ri"
                              :value="rq.questionid"
                              :label="rq.questiontitle"
                            ></el-option>
                            <!-- v-for 排在本题前面的所有单选题列表 (rq,ri) in getRelatableQuestions(i_q) 根据当前问题的索引找到question -->
                          </el-select>
                        </el-col>
                      </el-row>
                      <p>关联选项:</p>
                      <el-row>
                        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" :push="3">
                          <el-checkbox-group
                            v-model="question.rela.optionindex"
                            v-for="(ro,ri) in getOptions(question.rela.queid)"
                            :key="ri"
                          >
                            <!-- v-for 所选题目的所有选项 (ro,ri) in getOptions(question.rela.queid) -->
                            <el-checkbox :label="ri">{{ro.scontent}}</el-checkbox>
                          </el-checkbox-group>
                        </el-col>
                      </el-row>
                    </div>
                    <!-- 弹窗按钮 -->
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="delete_logic(question)">清 除</el-button>
                      <el-button type="primary" @click="save_logic(question)">确 定</el-button>
                    </span>
                  </el-dialog>
                </el-card>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from "../fetch/api";
// import _test_fix from "./json/test-fix.json";// 引入测试问卷修改
import _exam_model from "./json/exam-model.json"; // 引入考试模板
import _sigin_model from "./json/signin-model.json"; //引入签到模板
import _vote_model from "./json/vote-model.json"; //引入投票模板
import _investigation_model from "./json/investigation-model.json"; //引入调查模板
import format from "../js/format";
var questionId = 0; // 由前端页面分配每个问题的id

export default {
  name: "Edit",
  data() {
    return {
      modeltype: this.$route.query.modeltype,
      onLine: true, // 是否联网
      editVisible: false, // 是否显示标题编辑浮窗
      dialogVisible: false, // 编辑面板不显示
      templeTitle: "", //临时标题，还没有被保存的标题
      formData: {
        paperid: "", // 问卷id，等到保存问卷时，才在后端进行设置
        ispublish: 0, // 是否发布
        userid: this.$route.query.userid, // 用户id,获取从Model传来的用户id
        createtime: "", // 问卷创建时间
        papertitle: "问卷标题",
        questions: []
      },
      rules: {
        templeTitle: [
          { required: true, message: "问卷标题不能为空", trigger: "blur" },
          { max: 51, message: "字数不能多于51", rigger: "blur" }
        ],
        question_title: [
          { required: true, message: "题目不能为空", trigger: "blur" },
          { max: 51, message: "字数不能多于51", trigger: "blur" }
        ]
      }
    };
  },
  // 从localStorage 提取刷新前的数据
  created() {
    this.formData.userid = this.$route.query.userid;
    if (localStorage.getItem(this.formData.userid + "Edit")) {
      // 如果localStorage存有问卷表单数据
      // 获取保存在localStorage的表单数据
      this.formData = JSON.parse(
        localStorage.getItem(this.formData.userid + "Edit")
      );
    } // 如果没有保存说明是第一次进入，渲染问卷模板
    else {
      var modeltype = this.$route.query.modeltype;
      if (modeltype == 0) {
        this.formData = {
          paperid: "", // 问卷id，等到保存问卷时，才在后端进行设置
          ispublish: 0, // 是否发布
          userid: this.$route.query.userid, // 用户id,获取从Model传来的用户id
          createtime: "", // 问卷创建时间
          papertitle: "问卷标题",
          questions: []
        };
        this.editVisible = true;
      } else if (modeltype == 1) {
        this.formData = _investigation_model;
      } else if (modeltype == 2) {
        this.formData = _exam_model;
      } else if (modeltype == 3) {
        this.formData = _vote_model;
      } else if (modeltype == 4) {
        this.formData = _sigin_model;
      } else {
        // 根据获得的问卷id从后端获得要修改的问卷设置
        api
          .PostNewQuestionnaire(this.$route.query.paperid)
          .then(res => {
            if (res.code == "01") {
              questionId = res.result.questionId;
              this.formData = res.result.formData;
            } else {
              this.$alert(res.result, "获取问卷失败", {
                confirmButtonText: "确定"
              });
            }
          })
          .catch(error => {
            console.log(error);
          });

        // //模拟测试：
        // alert(this.$route.query.paperid);
        // questionId = 4;
        // this.formData = _test_fix;
      }
    }
  },
  mounted() {
    this.templeTitle = this.formData.papertitle;
  },
  // // 网络状态判断
  // mounted(){
  //     addEventListener("offline",()=>{
  //         this.onLine=false;
  //         // 发送断网提示
  //         this.$message({
  //             message:"网络连接不可用",
  //             type:"info"
  //         })
  //     })
  //     addEventListener("online",()=>{
  //         if(this.onLine==false)// 如果是从断网状态恢复
  //         {
  //             // 从localStroage中获取历史数据
  //             this.formData=this.storage.getItem("EditFormData");
  //         }
  //         this.onLine=true;
  //     })
  // },

  // 数据发生变化时保存数据到localstorage，防止刷新之后数据消失
  updated() {
    this.formData.userid = this.$route.query.userid;
    localStorage.setItem(
      this.formData.userid + "Edit",
      JSON.stringify(this.formData)
    );
  },
  methods: {
    // 提交数据前对数据进行处理，增加ip、goquestion、ans属性，返回处理好的对象array，不改变原有的 this.formData
    handleData(formData) {
      var array = formData; // 返回的结果,to是跳转问题的index
      array.createtime = format(new Date().toLocaleDateString(), "YYYY-MM-DD");
      for (
        var i = 0;
        i < array.questions.length;
        i++ // 遍历formData
      ) {
        if (array.questions[i].rela.optionindex.length > 0) {
          // 找到被关联题目下标i
          array.questions[i].show = false; // 隐藏被关联问题
          for (
            var j = 0;
            j < i;
            j++ // 在被关联题目前面寻找关联题目
          ) {
            if (
              array.questions[j].questionid == array.questions[i].rela.queid
            ) {
              // 找到关联题目的下标j
              for (
                var k = 0;
                k < array.questions[i].rela.optionindex.length;
                k++ // 被关联题目optionindex的下标k
              ) {
                array.questions[j].options[
                  array.questions[i].rela.optionindex[k]
                ].goquestion.push(i);

                // 下面这个不用加，因为goquestion是由optionindex确定的，而optionindex与多选组件绑定，值是不会重复的，加了反而有个奇怪的问题，第一次预览goquestion会是：{'_c':[]}
                // var t =
                //   array.questions[j].options[
                //     array.questions[i].rela.optionindex[k]
                //   ].goquestion;
                // array.questions[j].options[
                //   array.questions[i].rela.optionindex[k]
                // ].goquestion = new Set(t); // 去除重复项
                
              }
              break; // 找到之后可以直接处理下一题
            }
          }
        } else {
          array.questions[i].show = true;
        }

        // 填空题选项编号为0，多选题，单选题选项编号从1开始
        if (array.questions[i].type < 2) {
          // 在formatData里添加ans，记录选择题的答案（所选选项的下标）
          if (array.questions[i].type == 0) {
            // 如果是单选题,ans是int类型（先用null代替）
            array.questions[i].ans = null;
          } else if (array.questions[i].type == 1) {
            // 如果是多选题，ans是数组类型
            array.questions[i].ans = [];
          }
          // 添加选项id
          // 如果是选择题，options长度不为0，selectid从1开始编号
          for (var j = 0; j < array.questions[i].options.length; j++) {
            array.questions[i].options[j].selectid = j+1;
          }
        }
      }
      return array;
    },
    // 将问卷设置传到后端保存
    onSubmit(formData) {
      // 规则验证
      this.$refs["rulesForm1"].validate(valid => {
        if (valid) {
          // 提交处理好的数据 this.handleData(formData) 到后台,并跳转回个人主页
          api
            .PostNewQuestionnaire(this.handleData(formData))
            .then(res => {
              if (res.code == "01") {
                this.$router.go(-1);
                alert("保存成功！");
              } else if (res.code === "03") {
                this.$alert("登录过期，请重新登录", "提示", {
                  confirmButtonText: "确定"
                });
                this.$router.push({ path: "/login", query: { no_token: 1 } });
              } else {
                this.$alert(res.result, "保存失败", {
                  confirmButtonText: "确定"
                });
              }
            })
            .catch(error => {
              this.$message.error(error);
            });
        } else {
          return false;
        }
      });
    },
    // 跳转到预览页面
    toPreview() {
      this.$refs["rulesForm1"].validate(valid => {
        if (valid) {
          // 将处理好的数据保存在PreviewFormmData，方便预览界面使用
          // localStorage.setItem(this.formData.userid+"Pre",JSON.stringify(this.handleData(this.formData)))
          var fdata = this.handleData(this.formData);
          this.$router.push({ path: "/preview", query: { formData: fdata } }); // 跳转到预览界面
        } else {
          this.$message.error("error submit!!");
          return false;
        }
      });
    },
    // 确认问卷标题
    editBtn() {
      if (this.templeTitle != "") {
        this.formData.papertitle = this.templeTitle;
        this.editVisible = false;
      } else {
        this.editVisible = true;
      }
    },
    // 在没填写好标题前不能关闭确认问卷标题的按钮
    editDialogClose() {
      this.editVisible = true;
    },
    // 编辑面板的显示和隐藏
    show_edit_panel(i) {
      if (!this.formData.questions[i].show) {
        for (var j = 0; j < this.formData.questions.length; j++) {
          if (j != i) {
            this.formData.questions[j].show = false;
          }
        }
        this.formData.questions[i].show = true;
      } else {
        this.formData.questions[i].show = false;
      }
    },
    // 显示逻辑设置弹窗
    show_logic_dialog(i) {
      if (i == 0) {
        this.$message({
          message: "第一题不能设置逻辑关联",
          type: "info"
        });
        return;
      }
      this.dialogVisible = true;
    },
    // 已知question的id获取question
    getQuestion(questionid) {
      var array = this.formData.questions;
      for (var i = 0; i < array.length; i++) {
        if (array[i].questionid == questionid) {
          return array[i];
        }
      }
      return null;
    },
    // 根据问题id获取options
    getOptions(questionid) {
      var question = this.getQuestion(questionid);
      if (question) {
        return question.options;
      }
      return [];
    },
    // 获取目前题目前的所有单选题的id
    getRelatedQuestions(index) {
      var idList = [];
      var array = this.formData.questions;
      for (var i = 0; i < index; i++) {
        if (array[i].type == 0) {
          // 如果是单选题
          idList.push(array[i]);
          idList = Array.from(new Set(idList));
        }
      }
      return idList;
    },
    // 逻辑设置点击确定
    save_logic(question) {
      // 如果只设置题目没有设置选项，不保存设置
      if (question.rela.optionindex.length == 0) {
        question.rela.queid = null;
      }
      this.dialogVisible = false;
    },
    // 清除题目关联
    delete_logic(question) {
      question.rela.queid = null;
      question.rela.optionindex = [];
      this.dialogVisible = false;
    },
    // 增加题目
    add_question(type) {
      var question = {};
      question.show = false;
      question.questionid = ++questionId;
      question.type = type;
      question.questiontitle = "题目";
      question.err = false;
      question.ismust = 0;
      question.rela = {
        queid: null,
        optionindex: []
      };
      if (type == 0) {
        // 单选题
        question.options = [
          {
            scontent: "选项",
            goquestion: []
          }
        ];
      } else if (type == 1) {
        // 多选题
        question.min = 2;
        question.max = null;
        question.options = [
          {
            scontent: "选项",
            goquestion: []
          },
          {
            scontent: "选项",
            goquestion: []
          }
        ];
      } // 填空题
      else {
        question.scontent = "";
        question.goquestion = [];
        question.options=[];
      }
      this.formData.questions.push(question);
    },
    // 删除题目
    del_question(i_q) {
      var array = this.formData.questions;
      var questionid = array[i_q].questionid;
      //如果有关联，不能删除
      // 遍历后面的题目，看是否有被关联
      for (var i = i_q; i < array.length; i++) {
        if (array[i].rela.queid == questionid) {
          this.$message({
            message: "题目关联" + i + "题，不能删除！",
            type: "info"
          });
          return;
        }
      }
      // 如果关联题目，要清除相关题目
      this.formData.questions.splice(i_q, 1);
    },
    // 上移题目
    question_moveUp(i_q) {
      if (i_q > 0) {
        // 不是第一道题，可以上移
        if (
          this.formData.questions[i_q].rela.queid ==
          this.formData.questions[i_q - 1].questionid
        ) {
          this.$message({
            message: "被上一题关联，不能移动！",
            type: "info"
          });
          return;
        }
        var t1 = this.formData.questions[i_q];
        var t2 = this.formData.questions[i_q - 1];
        this.formData.questions.splice(i_q, 1, t2);
        this.formData.questions.splice(i_q - 1, 1, t1);
      }
    },
    // 下移题目
    question_moveDown(i_q) {
      if (i_q < this.formData.questions.length - 1) {
        // 不是最后一道题，可以下移
        if (
          this.formData.questions[i_q + 1].rela.queid ==
          this.formData.questions[i_q].questionid
        ) {
          this.$message({
            message: "关联下一题，不能移动！",
            type: "info"
          });
          return;
        }
        var t1 = this.formData.questions[i_q];
        var t2 = this.formData.questions[i_q + 1];
        this.formData.questions.splice(i_q, 1, t2);
        this.formData.questions.splice(i_q + 1, 1, t1);
      }
    },
    // 题目移动到最前
    question_moveFirst(i_q) {
      // 如果被关联，不能移动到最前
      if (this.formData.questions[i_q].rela.queid != null) {
        this.$message({
          message: "被前面题目关联，不能移动到最前！",
          type: "info"
        });
        return;
      }
      var t = this.formData.questions[i_q];
      this.formData.questions.splice(i_q, 1);
      this.formData.questions.unshift(t);
    },
    // 题目移动到最后
    question_moveLast(i_q) {
      for (var i = i_q; i < this.formData.questions.length; i++) {
        if (
          this.formData.questions[i].rela.queid ==
          this.formData.questions[i_q].questionid
        ) {
          this.$message({
            message: "关联后面的题目，不能移动到最后！",
            type: "info"
          });
          return;
        }
      }
      var t = this.formData.questions[i_q];
      this.formData.questions.splice(i_q, 1);
      this.formData.questions.push(t);
    },
    // 增加选项
    add_option(i_q, i_o) {
      var option = {};
      option.scontent = "选项";
      if (this.formData.questions[i_q].type == 0) {
        option.goquestion = [];
      }
      this.formData.questions[i_q].options.splice(i_o + 1, 0, option);
    },
    // 删除选项
    del_option(i_q, i_o) {
      this.formData.questions[i_q].options.splice(i_o, 1);
    },
    // 上移选项
    option_moveUp(i_q, i_o) {
      if (i_o > 0) {
        var t1 = this.formData.questions[i_q].options[i_o];
        var t2 = this.formData.questions[i_q].options[i_o - 1];
        this.formData.questions[i_q].options.splice(i_o, 1, t2);
        this.formData.questions[i_q].options.splice(i_o - 1, 1, t1);
      }
    },
    // 下移选项
    option_moveDown(i_q, i_o) {
      if (i_o < this.formData.questions[i_q].options.length - 1) {
        var t1 = this.formData.questions[i_q].options[i_o];
        var t2 = this.formData.questions[i_q].options[i_o + 1];
        this.formData.questions[i_q].options.splice(i_o, 1, t2);
        this.formData.questions[i_q].options.splice(i_o + 1, 1, t1);
      }
    }
  }
};
</script>
