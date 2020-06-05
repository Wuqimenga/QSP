<template>
    <div>
        <vheader content="预览" :backRouter="this.$router" />
        <el-tabs :stretch="true">
            <el-tab-pane label="默认报告">
                <result :paperid="paperid"/>
            </el-tab-pane>
            <el-tab-pane label="详细分析">
                <analysis :userid="userid" :paperid="paperid"/>
            </el-tab-pane>
            <el-tab-pane label="交叉分析">
                <cross  :userid="userid" :paperid="paperid"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Result from './Result'
import Cross from './CrossOverAnalysis'
import Analysis from './Analysis'

export default {
    data(){
        return{
            paperid:this.$route.query.paperid,
            userid:this.$route.query.userid,
        }
    },
    components:{
        "result":Result,
        "cross":Cross,
        "analysis":Analysis
    }
}
</script>