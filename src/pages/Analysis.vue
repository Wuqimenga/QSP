<template>
  <div class="app">
    <div v-for="(item,index) in qsdata" :key="index">
      <div class="option-card" v-if="item.topicid==='0'||item.topicid==='1'">
        <div>
          <div>
            <h6>
              {{item.questionid}}.{{item.questiontitle}}
              <small
                class="text-muted"
                v-if="item.topicid==='0'"
              >【单选题】</small>
              <small class="text-muted" v-if="item.topicid==='1'">【多选题】</small>
            </h6>
          </div>
          <table class="table table-bordered table-hover" v-if="item.tableStatus">
            <thead>
              <tr>
                <th scope="col">选项</th>
                <th scope="col">小计</th>
                <th scope="col">比例</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(option,key) in item.options" :key="key">
                <th scope="row"><span class="table-span">{{option.scontent}}</span></th>
                <td>{{option.selectnumber}}</td>
                <td>
                  <el-progress :percentage="option.selectnumber/item.answernumber*100"></el-progress>
                </td>
              </tr>
              <tr>
                <th scope="row"><span class="table-span">本题有效填写人数</span></th>
                <td>{{item.answernumber}}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
<div :id="item.questionid" v-show="item.wordStatus|item.barStatus|item.pieStatus" class="charts-item"></div>
        <ul class="header-ul-right">
          <li class="li-right">
            <el-button @click="transformTableStatus(item.questionid)">表格</el-button>
          </li>
          <li class="li-right">
            <el-button @click="paintBarforOption(item.questionid)">柱状图</el-button>
          </li>
          <li class="li-right">
            <el-button @click="paintPieforOption(item.questionid)">饼状图</el-button>
          </li>
        </ul>
      </div>
      <div class="filling-card" v-else>
        <div>
          <h6>
            {{item.questionid}}.{{item.questiontitle}}
            <small class="text-muted">【填空题】</small>
          </h6>
        </div>
        <div
          :id="item.questionid"
           v-show="item.wordStatus|item.barStatus|item.pieStatus"
           class="charts-item"
        ></div>
        <ul class="header-ul-right">
          <li class="li-right">
            <el-button @click="paintWord(item.questionid)">词频分析</el-button>
          </li>
          <li class="li-right">
            <el-button @click="paintBarforFill(item.questionid)">柱状图</el-button>
          </li>
          <li class="li-right">
            <el-button @click="paintPieforFill(item.questionid)">饼状图</el-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import api from "@/fetch/api";
let echarts = require("echarts/lib/echarts");
require("echarts-wordcloud");
require("echarts/lib/chart/bar");
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/toolbox");
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "echarts/theme/macarons.js";

export default {
  data() {
    return {
      qsdata: [
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
      ],
      paperid: "",
      charts:[],
    };
  },
  created() { 
    //获取数据放到qsdata中
/*     this.paperid = this.$route.query.paperid;
    api
      .GetResultToAnalysis(this.paperid)
      .then(res => {
        if (res.code === "01") {
          if (this.qsdata.length !== 0) {
            this.qsdata.splice(0, this.qsdata.length);
          }
          for (let i = 0; i < res.result.length; i++) {
            this.qsdata.push(res.result[i]);
          }
        } else if (res.code === "03") {
          //没退出页面过了一天之后，刷新页面后继续，要求重新登录
          this.$router.push({ path: "/login", query: { no_token: 1 } });
        } else {
          this.$message({ type: "info", message: res.result });
        }
      })
      .catch(error => {
        this.$message({ type: "info", message: error });
      }); */
          //初始化渲染echarts的块的大小
  },
  methods: {
    drawBar(questionid, xdata, ydata) {
      let myChart = this.$echarts.init(
        document.getElementById(questionid),
        "macarons"
      );
      myChart.setOption(
        {
          baseOption: {
            xAxis: {
              data: xdata
            },
            yAxis: {},
            series: [
              {
                type: "bar",
                data: ydata,
                label: {
                  normal: {
                    show: true,
                    formatter: "{c}",
                    position: "top",
                    textStyle: {
                      fontSize: 14
                    }
                  }
                },
                barWidth: 15,
                itemStyle: {
                  normal: {
                    color: "#409eff"
                  }
                }
              }
            ]
          },
          media: [
            {
              query: { maxWidth: 400 },
              option: {
                xAxis: {
                  data: xdata
                },
                yAxis: {},
                series: [
                  {
                    type: "bar",
                    data: ydata,
                    label: {
                      normal: {
                        show: true,
                        formatter: "{c}",
                        position: "top",
                        textStyle: {
                          fontSize: 14
                        }
                      }
                    },
                    barWidth: 3,
                    itemStyle: {
                      normal: {
                        color: "#409eff"
                      }
                    }
                  }
                ]
              }
            }
          ]
        },
        true
      );
    },
    drawPie(questionid, pdata) {
      let myChart = this.$echarts.init(
        document.getElementById(questionid),
        "macarons"
      );
      myChart.setOption(
        {
          series: [
            {
              type: "pie",
              center: ["50%", "50%"],
              radius: "55%",
              label: {
                normal: {
                  show: true,
                  formatter: "{b}",
                  textStyle: {
                    fontSize: 14
                  }
                }
              },
              data: pdata
            }
          ]
        },
        true
      );
    },
    drawWordCloud(questionid, wdata) {
      let myChart = this.$echarts.init(
        document.getElementById(questionid),
        "macarons"
      );
      myChart.setOption(
        {
          series: [
            {
              type: "wordCloud",
              sizeRange: [10, 86],
              textStyle: {
                normal: {
                  color: function() {
                    return (
                      "rgb(" +
                      [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                      ].join(",") +
                      ")"
                    );
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowColor: "#333"
                }
              },
              data: wdata
            }
          ]
        },
        true
      );
    },
    transformTableStatus(questionid) {
      this.qsdata.forEach(item => {
        if (item.questionid === questionid) {
          if (item.tableStatus === true) {
            item.tableStatus = false;
          } else {
            item.tableStatus = true;
          }
        }
      });
    },
    paintWord(questionid) {
      this.qsdata.forEach(item => {
        if (item.questionid === questionid) {
          if (item.wordStatus === true) {
            item.wordStatus = false;
          } else {
            item.wordStatus = true;
            item.barStatus = false;
            item.pieStatus = false;
            this.drawWordCloud(questionid, item.answers);
          }
        }
      });
    },
    paintBarforOption(questionid) {
      this.qsdata.forEach(item => {
        if (item.questionid === questionid) {
          if (item.barStatus === false) {
            item.barStatus = true;
            item.pieStatus = false;
            let xdata = [];
            let ydata = [];
            item.options.forEach(option => {
              xdata.push(option.scontent);
              ydata.push(option.selectnumber);
            });
            this.drawBar(questionid, xdata, ydata);
          } else {
            item.barStatus = false;
          }
        }
      });
    },
    paintBarforFill(questionid) {
      this.qsdata.forEach(item => {
        if (item.questionid === questionid) {
          if (item.barStatus === false) {
            item.barStatus = true;
            item.pieStatus = false;
            let xdata = [];
            let ydata = [];
            item.answers.forEach(answer => {
              xdata.push(answer.name);
              ydata.push(answer.value);
            });
            this.drawBar(questionid, xdata, ydata);
          } else {
            item.barStatus = false;
          }
        }
      });
    },
    paintPieforOption(questionid) {
      this.qsdata.forEach(item => {
        if (item.questionid === questionid) {
          if (item.pieStatus === false) {
            item.pieStatus = true;
            item.barStatus = false;

            let pdata = [];
            item.options.forEach(option => {
              pdata.push({ value: option.selectnumber, name: option.scontent });
            });
            this.drawPie(questionid, pdata);
          } else {
            item.pieStatus = false;
          }
        }
      });
    },
    paintPieforFill(questionid) {
      this.qsdata.forEach(item => {
        if (item.questionid === questionid) {
          if (item.pieStatus === false) {
            item.pieStatus = true;
            item.barStatus = false;
            item.wordStatus = false;
            this.drawPie(questionid, item.answers);
          } else {
            item.pieStatus = false;
          }
        }
      });
    },
  }
};
</script>
<style scoped>
.option-card {
  width: 100%;
  margin: calc(10vh) auto;
}
.li-right {
  display: inline;
  padding-left: calc(4vw);
}
.header-ul-right {
  margin: calc(2vh) 0;
  float: right;
  padding: 0;
  border: 0;
}
.filling-card {
  width: 100%;
  margin: calc(10vh) auto;
}
.charts-item{
  width:calc(80vw);
  height:calc(40vh);
}
.app{
  width:calc(80vw);
  top:0; bottom:0; left:0; right:0; margin:auto;
}
.table-span{
  width:100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
</style>