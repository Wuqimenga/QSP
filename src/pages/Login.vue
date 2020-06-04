<template>
  <div id="app">
    <el-row type="flex" justify="center">
      <el-col :xs="18" :sm="12" :md="10" :lg="4" :xl="4">
        <div id="title"></div>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center">
      <el-col :xs="18" :sm="12" :md="10" :lg="4" :xl="4">
        <el-card>
          <el-form type="flex" justify="center" ref="loginForm" :model="user" :rules="rule">
            <el-form-item prop="name">
              <el-input @keyup.enter="loginActon" v-model="user.name" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item porp="name">
              <el-input
                type="password"
                @keyup.enter="loginAction"
                v-model="user.password"
                placeholder="密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button id="lbtn" type="primary" @click="loginAction" align="left">登录</el-button>
            </el-form-item>
            <el-form-item>
              <el-button id="rbtn" @click="registerAction" align="right">注册</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/ecmascript-6">
import api from "@/fetch/api";
export default {
  name: "app",
  data() {
    return {
      user: { name: "", password: "" },
      rule: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {
    if (this.$route.query.no_token) {
      this.$alert("无令牌", "提示", {
        confirmButtonText: "确定"
      });
    }
  },
  methods: {
    loginAction: function() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          api
            .Login(this.user)
            .then(res => {
              if (res.code == "01") {
                //存储token到本地存储
                localStorage.setItem("token", res.token);
                //跳转到个人主页
                this.$router.push({
                  path: "/home",
                  query: { userid: res.result.userid }
                });
              } else {
                this.$message({ type: "warning", message: res.result });
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
    registerAction: function() {
      this.$router.push({ path: "/register" });
    }
  }
};
</script>

<style scoped>
#title {
  height: calc(20vh);
}
#lbtn,
#rbtn {
  width: 100%;
}
</style>
