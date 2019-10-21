<template>
  <div class="studentInfo">
    <div class="studentInfo">
      <el-table :data="studentInfo" style="width: 100%">
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="dName" label="院系"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="setStudentInfo">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改学生信息界面-->
    <el-dialog :title="'修改信息'" :visible.sync="updateStudentMessage">
      <div class="edit_user_main">
        <div>
          <p>姓名：</p>
          <el-input type="text" :row="5" v-model="updateStudent.updateUsername"></el-input>
        </div>
        <div>
          <p>电话：</p>
          <el-input type="text" :row="5" v-model="updateStudent.updateMobile"></el-input>
        </div>
        <div>
          <p>角色：</p>
          <el-input type="text" :row="5" v-model="updateStudent.updateRoleName" :disabled="true"></el-input>
        </div>
        <div>
          <p>院系：</p>
          <el-input type="text" :row="5" v-model="updateStudent.updateDName" :disabled="true"></el-input>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="updateStudentMessage = false">取 消</el-button>
        <el-button type="primary" @click="updateStudentInfo()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from "element-ui";
import qs from "qs";
export default {
  name: "studentInfo",
  data() {
    return {
      studentInfo: [],
      courseData: {},
      username: "", //姓名
      mobile: "", //电话
      roleName: "", //角色
      dName: "", //院系

      updateStudent: {
        updateUsername: "", //修改的姓名
        updateMobile: "", //修改的电话
        updateRoleName: "", //修改的角色
        updateDName: "" //修改的院系
      },

      updateStudentMessage: false //修改题目提示
    };
  },
  methods: {
    // 获取学生信息
    getStudentInfo() {
      this.ax.get("/teacher/getTeacherByid").then(it => {
        this.studentInfo.push(it);
        console.log(this.studentInfo);
      });
    },

    //修改学生信息
    setStudentInfo() {
      
      //将学生信息赋值给修改界面的信息
      this.updateStudent.updateUsername = this.studentInfo[0].username;
      this.updateStudent.updateMobile = this.studentInfo[0].mobile;
      this.updateStudent.updateRoleName = this.studentInfo[0].roleName;
      this.updateStudent.updateDName = this.studentInfo[0].dName;
      this.updateStudentMessage = true;
    },

    //点击确定修改学生信息
    updateStudentInfo() {
      let data={
        username:this.updateStudent.updateUsername,
        mobile:this.updateStudent.updateMobile
      }
      this.ax.post("/teacher/updateUserInfo",data).then(it=>{
        if(it==true){
          Message({
          message: "修改信息成功",
          type: "success"
        });
        //修改界面信息
        this.studentInfo[0].username=this.updateStudent.updateUsername;
        this.studentInfo[0].mobile=this.updateStudent.updateMobile;
        //关闭修改界面
        this.updateStudentMessage = false;
        }else{
           Message({
          message: "请填写正确课程信息",
          type: "warning"
        });
        }
        
      })
    }
  },
  created() {},
  mounted() {
    this.getStudentInfo();
  },
  activated() {}
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.studentInfo {
  .userList {
    .user_avatar {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }
    .user_desc {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 300px;
    }
  }
}
</style>