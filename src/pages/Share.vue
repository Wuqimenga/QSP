<template>

    <div id="app">

        <el-button type="primary" @click="qrCode()" style="margin-left: 45%;margin-top: 10%">生成二维码</el-button>
        <!-- 弹窗提示-->
        <el-dialog title="问卷分享码" :visible.sync="dialogVisible" width="250px">
            <div id="qrcode" style="margin-left: 15%">
              <canvas id="can"></canvas>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="downLoadFunc">下 载</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>

            </span>
        </el-dialog>
    </div>
</template>


<script type="text/ecmascript-6">
  // import QRCode from 'qrcodejs2'
  import * as qrcode from "jsonwebtoken";

  export default {
        name: "share",

        data(){
            return{
              dialogVisible:false,
              //获取从“发布问卷”按钮那里传过来的id值
              userId:this.$route.params.userId,
              //userId:102,
              //需要跳转的页面为“answer.vue”
              url:"/answer"
            }
        },
        methods:{
            qrCode(){
              //var codeText = window.location.href;
              //url和id之间用“？”分隔开
              var codeText = String(this.url+"?"+this.userId);
              console.log(codeText);
              this.dialogVisible = true;
              this.$nextTick(function () {
                document.getElementById("qrcode").innerHTML = "";
                let qrcode = new QRCode("qrcode", {
                  width: 150,
                  height: 150,
                  text:codeText,
                  colorDark: "#109dff",
                  colorLight: "#d9d9d9"
                });
              });
            },

          //下载二维码
          downLoadFunc:function(){
            var temp=$('#qrcode').children('canvas');
            var a=document.createElement("a");
            a.href=temp[0].toDataURL();
            a.download="drcQrcode";
            a.click();
          }

        }
    }
</script>

<style scoped>

</style>
