<template>
  <el-form
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="旧密码" prop="pass">
      <el-input type="password" v-model="ruleForm.pass"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPass">
      <el-input type="password" v-model="ruleForm.newPass"></el-input>
    </el-form-item>
    <el-form-item label="确认新密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { Message, MessageBox } from "element-ui";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else if (value !== this.userInfo.password) {
        callback(new Error("旧密码不正确，请重新输入！"));
      } else {
        callback();
      }
    };
    return {
      userInfo: {},
      ruleForm: {
        pass: "",
        checkPass: "",
        newPass: ""
      },
      rules: {
        pass: [{ validator: validatePass3, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        newPass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 获取学生信息
    getStudentInfo() {
      this.ax.get("/teacher/getTeacherByid").then(it => {
        this.userInfo = it;
        console.log(this.userPass);
      });
    },
    //点击提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        //输入的密码通过校验，则提交密码到后台，
        if (valid) {
          let data = {
            password: this.ruleForm.newPass,
            userId: this.userInfo.userId
          };
          console.log(data);
          //将数据提交到后台
          this.ax.post("/user/password/update", data).then(it => {
            Message({
              message: "密码修改成功",
              type: "success"
            });
            this.$router.push({path:"/login"});
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    this.getStudentInfo();
  }
};
</script>