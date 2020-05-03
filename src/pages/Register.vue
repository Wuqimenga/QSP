<template>
  <div id="app">
    <el-row type="flex" justify="center">
      <el-col :xs="16" :sm="8" :md="6" :lg="4" :xl="4">
        <div id="title"></div>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center">
      <el-col :xs="16" :sm="8" :md="6" :lg="4" :xl="4">
        <el-card>
          <el-form ref="registerForm" :model="user" :rules="rule">
            <el-form-item prop="username">
              <el-input v-model="user.username" placeholder="登陆名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="user.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="repwd">
              <el-input type="password" v-model="user.repwd" placeholder="确认密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="registerAction" id="btn_reg">注册</el-button>
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
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        let reg=/^[a-z0-9]{6,12}$/i;
        if(!reg.test(value))
        {
          callback(new Error("密码由6到12个字母或者数字组成，请注意格式"))
        }
      else {
        if (this.user.repwd !== "") {
          this.$refs.registerForm.validateField("repwd");
        }
        callback();
      }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.user.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      user: { username: "", password: "", repwd: "" },
      rule: {
        username: [{ required: true, message: "请输入登陆名", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "change" }],
        repwd: [{ validator: validatePass2, trigger: "change" }]
      }
    };
  },
  computed: {},
  methods: {
    registerAction: function() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.$delete(this.user,'repwd');
          api
            .Register(this.user)
            .then(res => {
              if (res.code == "01") {
                this.$router.push({path:"/login"})
              } else {
                this.$alert(res.result, "提示", {
                  confirmButtonText: "确定"
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
#title{
  height: calc(25vh);
}
#btn_reg{
  width:100%;
}
</style>
