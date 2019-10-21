<template>
  <div class="studentCourse">
    <div class="studentCourse">
      <div slot="top-actions">
        <el-button type="primary" @click="addCourse()">添加科目</el-button>
      </div>
      <el-table :data="courseData" style="width: 100%">
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="cname" label="科目"></el-table-column>
        <el-table-column prop="dept_name" label="院系"></el-table-column>
        <el-table-column prop="username" label="任课教师"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="removeCourse(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { Message, MessageBox } from "element-ui";
import qs from "qs";
export default {
  name: "studentCourse",
  data() {
    return {
      courseData: [],
      username: "", //任课教师姓名
      cname: "", //科目
      dept_name: "", //院系
      course: "", //课程

    };
  },
  methods: {
     // 获取学生信息
    getStudentInfo() {
      this.ax.get("/teacher/getTeacherByid").then(it => {
        this.studentInfo = it;
        console.log(this.studentInfo);
        this.getCoursetData();
      });
    },
    //点击添加
    addCourse() {
      //跳转到添加课程页面
      this.$router.push({path:"/student/addcourse"});
    },
    // 获取科目列表信息
    getCoursetData() {
       //学生id
      var stuId = this.studentInfo.userId;
      this.ax.get("/user/sut/findcByuserid",{params:{
        uid:stuId
      }}).then(it => {
        this.courseData = it.dataList;
        console.log(this.courseData);
      });
    },

    //删除课程
    removeCourse(row) {
     console.log(row.conid);
     this.ax.get("/user/sut/delCourse",{params:{
       conid:row.conid
     }}).then(it=>{
       console.log(it);
       this.getCoursetData();
     })
    }
  },
  created() {},
  activated() {
    this.getStudentInfo();
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.studentCourse {
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