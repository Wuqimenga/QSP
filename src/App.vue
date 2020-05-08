<template>
  <keep-alive><router-view></router-view></keep-alive>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'app',
  //用于全局判断网络是否连接
  data(){
    return{
      network:true
    };
  },
  //用于监听网络情况
  mounted() {
    window.addEventListener("offline",()=>{
      alert("Network Unconnected");
      console.log("Network Unconnected");
      this.network=false;
    });
    window.addEventListener("online",()=>{
      alert("Network Connected");
      console.log("Network Connected");
      this.network=true;
    });
  }
}
</script>

