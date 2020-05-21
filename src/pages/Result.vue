<template>
  <div>
      <div class="listContent">
      <!--列表形式-->
      <el-table
        v-if="ansData"
        :data="ansData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        :cell-style="cellStyle"
        :header-cell-style="rowClass"
        border>
        <el-table-column label="序号" type="index" :index="indexMethod" width="50px">
        </el-table-column>
        <el-table-column prop="anstime" label="创建时间"></el-table-column>
        <el-table-column prop="IP" label="ip地址"></el-table-column>
        <el-table-column prop="location" label="ip地址"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button class="deleteBut" @click="deleteAction(scope.$index)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        v-if="ansData"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,12,20,40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="ansData.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    //Result.vue//参考设计稿的统计页面，提交问卷id，返回问卷的总体填写信息，问卷id参考share
    import api from "../fetch/api";
    import answerData from "../../static/answerData"

    export default {
        name: "Result",

        data(){
            //返回数据：id
            return{
              //userId:this.$route.params.userId,

              paperId:this.$route.params.paperid,//问卷id
              //数组形式
              ansData:[],
              pageSize: 12,//每一页的记录数量
              currentPage: 1,//默认从第一页开始浏览
              thisList:0,
            }
        },

      //数组赋值，测试数据时用
        /*mounted() {
          this.getAnswerData()
        },*/

        //后台传入数据的时候使用，为ansData赋值
        created() {
          api
            .GetStatics(this.paperId)// 提交问卷id到后端
            .then(res =>{
              if(res.code == "01"){
                this.ansData=res.result;
              }else{
                this.$alert(res.result,"无法获取答卷列表",{
                  confirmButtonText:"确定"
                });
              }
            })
            .catch(error =>{
              console.log(error);
            });
        },

        components:{},

        methods:{

          //数组赋值，测试数据时用
          /*getAnswerData(){
            this.ansData=answerData.answerData;
          },*/

          back(){this.$route.go(-1);},

          //表格项目样式
          cellStyle({row,column,rowIndex,columnIndex}){
            return "text-align:center;";
          },
          //表格头样式
          rowClass({row,rowIndex}){
            return "text-align:center;background-color: #1989fa!important;color:#fff;font-weight:400;";
          },

          //修改每页展示记录条数后改变pageSize
          handleSizeChange:function(size){
            this.pageSize=size;
            //console.log(this.pageSize);
          },

          //翻页
          handleCurrentChange:function(currentPage){
            this.currentPage=currentPage;
            //console.log(this.currentPage);
          },

          //实现翻页后序号递增
          indexMethod(index){
            return (index+1)+(this.currentPage-1)*this.pageSize;
          },

          //删除答卷
          deleteAction:function(index){

            this.$confirm('删除该答卷？','提示',{
              confirmButtonText:'确定',
              cancelButtonText:'取消',
              type:'warning'
            })
            .then(()=>{
              //从页面上删除答卷
              var paperId = this.ansData[index].paperid;
              var IP = this.ansData[index].IP;
              this.ansData.splice(index,1);
              console.log(JSON.stringify(this.ansData));

              //调用api接口，将删除后的数据写进后端数据库
              api
              .DeleteAnswer(paperId,IP)
              .then(res=>{
                if(res.code == '01'){
                  this.$router.go(-1);
                }else {
                  this.$alert(res.result,"删除失败",{
                    confirmButtonText:'确定'
                  });
                }
              })
              .catch(error=>{
                console.log(error);
              })
            })
            .catch(()=>{
              this.$message({
                type:'info',
                message:'已取消删除'
              });
            });

          }
        }
    }
</script>

<style scoped>
  .listContent{
    width:50%;
    margin: 0 auto;
  }

</style>
