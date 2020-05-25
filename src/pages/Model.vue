<template>
    <div>
        <!-- <h1>{{querylist}}</h1> -->
        <vheader content="选择创建类型" :backRouter="this.$router"/>
        <div class="center-plane">
        <el-row :gutter="10">

            <el-col  :xs="12" :sm="4" :md="4" :lg="4" :xl="4">
            <el-button @click="chooseType(0)" class="fill">
                <i class="el-icon-plus"></i>
                <p>空白问卷</p>
            </el-button>
            </el-col>

            <el-col  :xs="12" :sm="4" :md="4" :lg="4" :xl="4" >
            <el-button  @click="chooseType(1)" class="fill">
                <i class="el-icon-s-data "></i>
                <p>调查</p>
            </el-button>
            </el-col>

            <el-col  :xs="12" :sm="4" :md="4" :lg="4" :xl="4">
            <el-button  @click="chooseType(2)" class="fill">
                <i class="el-icon-document-checked "></i>
                <p>考试</p>
            </el-button>
            </el-col>

            <el-col  :xs="12" :sm="4" :md="4" :lg="4" :xl="4">
            <el-button  @click="chooseType(3)" class="fill">
                <i class="el-icon-printer "></i>
                <p>投票</p>
            </el-button>
            </el-col>

            <el-col  :xs="12" :sm="4" :md="4" :lg="4" :xl="4">
            <el-button  @click="chooseType(4)" class="fill">
                <i class="el-icon-s-custom "></i>
                <p>签到</p>
            </el-button>
            </el-col>

        </el-row>
        </div>

    </div>
</template>
<script>
export default {
    data(){
        return{
            querylist:{
                userId:this.$route.query.userId,
                modeltype:0
            }
        }
    },
    methods:{
        chooseType(type)
        {
            window.localStorage.clear();
            this.querylist.modeltype = type;
            this.$router.push({
                name: "Edit",
                query: this.querylist 
            });
        }
    }
}
</script>