<template>
    <div>
        <button @click="Testaction()">测试</button>
        <h1>{{res}}</h1>
    </div>
</template>
<script>
import api from "../fetch/api"
export default {
    data(){
        return {
            res:""
        }
    },
    methods:{
        Testaction(){
            api.CrossAnalysis({paperid:'1',X:[0],Y:1}).then(res=>{
                this.res=res
            }).catch(err=>{
                this.res=err
            })
        }
    }
}
</script>