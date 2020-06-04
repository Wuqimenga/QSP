<template>
  <div>
    <abc :isPreview="false" :formData="formData"></abc>
  </div>
</template>
<script>
import QueTemple from "./QueTemple";
export default {
  data() {
    return {
      paperid: 0, // 还没完整，从问卷链接或二维码获取问卷id
      formData: {}
    };
  },
  created() {
    // 根据问卷id从后端获取问卷信息f res.result
    // res.result 结构参考：答卷JSON结构.json
    api
      .GetQuestionnaireToanswer(this.paperid) // 提交问卷id到后端
      .then(res => {
        if (res.code == "01") {
          this.formData = res.result;
        } else {
          this.$message({ type: "warning", message: res.result });
        }
      })
      .catch(error => {
        this.$message.error(error);
      });
  },
  components: {
    abc: QueTemple
  }
};
</script>