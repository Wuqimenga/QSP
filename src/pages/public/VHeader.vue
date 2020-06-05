<template>
<div>
    <div class="vheader">
        <div class="tvhead">
            <div style="width:70px; height:20px; border-right:1px solid #EBEEF5;">
                <i class="el-icon-back" style="fontSize:20px;"></i><a @click="back()">返回</a>
            </div>
            <div style="position:relative; left:90px; top:-20px;"><h5>{{content}}</h5></div>
        </div>
    </div>
    <div style="height:50px;"></div>
</div>
</template>
<script>
export default {
    props:{
        content:"",
        backRouter:"",
    },
    methods:{
        back(){
            this.backRouter.go(-1);
        }
    }
}
</script>
<style scoped>
.vheader{
    /* margin:  5px 0 20px 0; */
    border-bottom: 1px #DCDFE6 solid;
    position: fixed;
    top:0;
    height: 50px;
    width: 100%;
    z-index: 999;
}
.tvhead{
    padding:10px;
    background-color: white;
    height:50px;
    width:100%;
    border-bottom: 1px solid #EBEEF5;
}
</style>