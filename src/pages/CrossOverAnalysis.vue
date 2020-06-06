<template>
  <div class="center-plane">
    <el-backtop></el-backtop>

    <div class="my-card">
      <h4>交叉分析</h4>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="{span: 8, offset: 4}" :xl="{span: 8, offset: 4}">
          <p>自变量X [最多选2题]</p>
          <el-select v-model="crossQue.X[0]" placeholder="请选择" clearable class="fill">
            <el-option
              v-for="item in selectQues"
              :key="item.questionid"
              :label="item.questiontitle"
              :value="item.questionid"
            ></el-option>
          </el-select>
          <el-select v-model="crossQue.X[1]" placeholder="请选择" clearable class="fill row-spacing">
            <el-option
              v-for="item in selectQues"
              :key="item.questionid"
              :label="item.questiontitle"
              :value="item.questionid"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <p>因变量Y</p>
          <el-select v-model="crossQue.Y" placeholder="请选择" clearable class="fill">
            <el-option
              v-for="item in selectQues"
              :key="item.questionid"
              :label="item.questiontitle"
              :value="item.questionid"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <p style="color:red">{{this.submitErr}}</p>
        </el-col>
      </el-row>
      <el-button @click="getCrossAnalysis()" size="small" type="primary">交叉分析</el-button>
    </div>

    <el-button
      @click="changeVisible(tableVisible)"
      size="small"
      class="left-float"
      icon="el-icon-s-grid"
    >表格</el-button>

    <el-button
      @click="changeVisible(tableVisible)"
      size="small"
      class="left-float"
      icon="el-icon-s-data"
    >柱状图</el-button>
    <!-- 交叉分析表 -->
    <div v-if="tableVisible">
      <p>{{crossQue.Y}}、{{Ytitle}}</p>
      <el-table :data="crossTable" show-overflow-tooltip size="mini" border style="width: 100%">
        <el-table-column v-for="(name,ci) in col_name" :key="ci" :prop="name" :label="name"></el-table-column>
      </el-table>
    </div>
    <!-- 交叉分析图表 -->
    <div id="myChart" :style="{margin:'0 auto',width: '80%', height: '250px'}"></div>
  </div>
</template>


<script>
import api from "../fetch/api";
import _get_cross_over_analysis from "./json/get-cross-over-analysis.json";// 引入模拟后端通过/get-analysis 传给前端的数据
import _get_analysis from "./json/get-analysis.json";// 引入模拟后端通过/get-analysis 传给前端的数据

export default {
  data() {
    return {
      crossTable: [], // 用于生成交叉分析表格
      Ytitle: "", // 作为因变量的题目内容
      tableVisible: false, // 表格显示
      barVisible: false, // 柱状图显示
      submitErr: "",
      selectQues: {},
      crossQue: {
        X: [],
        Y: null
      },
      option: {},
      myChart: null
    };
  },
  props:{
    paperid:"",
    userid:null
  },
  mounted() {
    window.onresize = () => {
      if (this.myChart) {
        this.myChart.resize();
      }
    };
  },
  computed: {
    // 交叉分析表属性行
    col_name: function() {
      if (this.option.xAxis) {
        var col_name = [];
        col_name.push("X/Y");
        for (var i = 0; i < this.option.series.length; i++) {
          col_name.push(this.option.series[i].name);
        }
        col_name.push("小计");
        return col_name;
      }
      return [];
    }
  },
  created() {
    
    // 向后端发送请求，返回详细作答信息以作数据分析
    api
      .GetResultToAnalysis({
        userid: this.userid,
        paperid: this.paperid
      })
      .then(res => {
        if (res.code === "01") {
          this.selectQues = this.getSelectQuestions(res.result);
        } else if (res.code === "03") {
          this.$alert("登录过期，请重新登录", "提示", {
            confirmButtonText: "确定"
          });
          this.$router.push({ path: "/login", query: { no_token: 1 } });
        } else {
          this.$message({ type: "warning", message: res.result });
        }
      })
      .catch(error => {
        this.$message.error(error);
      });
    // this.selectQues = _get_analysis.result;
    // console.log(JSON.stringify(this.selectQues))
  },
  methods: {
    // 切换显示状态
    changeVisible(flag) {
      this.tableVisible = !flag;
    },
    // 获取问卷所有的选择题
    getSelectQuestions(result) {
      var selectQues = [];
      for (var i = 0, j = 0; i < result.length; i++) {
        // 选择题
        if (result[i].type < 2) {
          selectQues.push({
            questionid:result[i].questionid,
            questiontitle:result[i].questiontitle
          })
          j++;
        }
      }
      return selectQues;
    },
    // 处理成堆叠条形图
    setToBar(option) {
      var tp = option;
      var data = [];
      for (var i = 0; i < tp.series.length; i++) {
        tp.series[i].type = "bar";
        tp.series[i].stack = "one";
        data[i] = tp.series[i].name;
      }
      tp.tooltip = {};
      tp.legend = { data: data };
      tp.toolbox = {
        feature: {
          magicType: {
            type: ["stack", "line", "bar"]
          }
        }
      };
      return tp;
    },
    // 向后端提交需要进行交叉分析的题目
    getCrossAnalysis() {
      // 对crossQue进行处理，去掉""元素
      for(var i=0;i<this.crossQue.X.length;i++)
      {
        if(this.crossQue.X[i]==="")
        {
          this.crossQue.X.splice(i,1);
        }
      }
      if(this.crossQue.Y===""){this.crossQue.Y=null;}
      // 对crossQue处理完毕

      // 对不合法输入的判断和提示
      if (
        this.crossQue.X===[] 
      ) {
        this.submitErr = "自变量不能为空";
      } else if (this.crossQue.Y===null) {
        this.submitErr = "因变量不能为空";
      } else if (
        this.crossQue.X[0] === this.crossQue.X[1] ||
        this.crossQue.Y === this.crossQue.X[0] ||
        this.crossQue.Y === this.crossQue.X[1]
      ) {
        this.submitErr = "题目不能重复"; // 有重复
      } else {
        this.submitErr = "";// 清空警示
        // 提交crossQue到后端，获得交叉分析数据
        api
          .CrossAnalysis({ paperid: this.paperid,  X:this.crossQue.X, Y:this.crossQue.Y })
          .then(res => {
            if (res.code == "01") {
              this.option = res.result;
              console.log(JSON.stringify(this.option));
              // 数据处理
              // 基于准备好的dom，初始化echarts实例
              const myChart = (this.myChart = this.$echarts.init(
                document.getElementById("myChart")
              ));
              // 绘制图表
              var option = this.setToBar(this.option);
              myChart.setOption(option);

              // 绘制表格
              this.crossTable = this.setToCrossTable();
              // 显示表格
              this.tableVisible = true;
              // 因变量标题
              for (var i = 0; i < this.selectQues.length; i++) {
                if (this.selectQues[i].questionid == this.crossQue.Y) {
                  this.Ytitle = this.selectQues[i].questiontitle;
                  break;
                }
              }
            } else if (res.code == "02") {
              this.$message({ type: "warning", message: res.result });
            } else {
              this.$alert("登录过期，请重新登录", "提示", {
                confirmButtonText: "确定"
              });
              this.$router.push({ path: "/login", query: { no_token: 1 } });
            }
          })
          .catch(error => {
            this.$message.error(error);
          });

              // this.option = _get_cross_over_analysis.result;
              // // 数据处理
              // // 基于准备好的dom，初始化echarts实例
              // const myChart = (this.myChart = this.$echarts.init(
              //   document.getElementById("myChart")
              // ));
              // // 绘制图表
              // var option = this.setToBar(this.option);
              // myChart.setOption(option);

              // // 绘制表格
              // this.crossTable = this.setToCrossTable();
              // // 显示表格
              // this.tableVisible = true;
              // // 因变量标题
              // for (var i = 0; i < this.selectQues.length; i++) {
              //   if (this.selectQues[i].questionid == this.crossQue.Y) {
              //     this.Ytitle = this.selectQues[i].questiontitle;
              //     break;
              //   }
              // }
      }
    },
    // 处理option获得交叉分析表
    setToCrossTable() {
      if (!this.option.series) {
        return;
      }
      // 返回json，json键为列名（第一行），值为后面的行
      var json = [];
      var total = []; // 每行总和，用于计算百分比
      var row_num = this.option.xAxis.data.length; // 行数
      var col_num = this.option.series.length; // 列数
      for (var i = 0; i < row_num; i++) {
        json[i] = {};
        total[i] = 0;
        json[i]["X/Y"] = this.option.xAxis.data[i];
        for (var j = 0; j < col_num; j++) {
          json[i][this.option.series[j].name] = this.option.series[j].data[i];
          total[i] += this.option.series[j].data[i];
        }
        json[i]["小计"] = total[i];
      }
      // 计算百分比
      for (var i = 0; i < row_num; i++) {
        for (var j = 0; j < col_num; j++) {
          var num = json[i][this.option.series[j].name];
          json[i][this.option.series[j].name] =
            num + "(" + ((num / total[i]) * 100).toFixed(2) + "%)";
        }
      }
      return json;
    }
  }
};
</script>

<style scoped>
.cross-chart{
  margin:0 auto;
  width: 25%;
  height: 250px;
}
@media screen and (min-width: 1000px){
  .cross-chart{width: 80%;}
}
</style>