<template>
  <div class="studentEvaluation">
    <div class="studentEvaluation">
      <el-table :data="courseData" style="width: 100%">
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="cname" label="科目"></el-table-column>
        <el-table-column prop="dept_name" label="院系"></el-table-column>
        <el-table-column prop="username" label="任课教师"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="entryEvaluation(scope.row)" v-if="!scope.row.isEvaluation">进入评教</el-button>
            <el-button size="mini" type="primary" @click="entryEvaluation(scope.row)" v-if="scope.row.isEvaluation">查看评教</el-button>
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
  name: "studentEvaluation",
  data() {
    return {
      courseData: [],
      username: "", //任课教师姓名
      cname: "", //科目
      dept_name: "", //院系
      course: "", //课程
      tid: "", //教师id
      uid: "", //登录用户id
      alreadyEvalution: [], //已经评教的教师列表
      course:[],
      isEvaluation:"",
    };
  },
  methods: {
    // 获取教师信息
    getStudentInfo() {
      this.ax.get("/teacher/getTeacherByid").then(it => {
        this.studentInfo = it;
        console.log(this.studentInfo);
        this.uid = this.studentInfo.userId; //获取登录用户的id
        this.getCoursetData();
      });
    },
    //点击添加
    addCourse() {
      //跳转到添加课程页面
      this.$router.push({ path: "/student/addcourse" });
    },
    // 获取科目列表信息
    getCoursetData() {
      //学生id
      var deptid=this.studentInfo.deptId;
      var stuId = this.studentInfo.userId;
    //   console.log(deptid)
      this.ax
        .get("/e/findColleague", {
          params: {
            deptid: deptid,
            uid:stuId
          }
        })
        .then(it => {
          // this.courseData = it.dataList;
           this.courseData = it.dataList.map(i => {
           this.$set(i,"isEvaluation","")
            return i
          })
          console.log(this.courseData )
          //获取已经评教的课程
          this.ax
            .get("/e/findevaluationbyid", {
              params: {
                id: stuId
              }
            })
            .then(it => {
              this.alreadyEvalution = it.dataList;
              console.log(this.alreadyEvalution)
              //将已经评教的教师剔除
              this.courseData.forEach((e, i) => {
                this.alreadyEvalution.forEach((item, j) => {
                  if (this.courseData[i].uid == this.alreadyEvalution[j].tid) {                    
                      this.courseData[i].isEvaluation="true";                     
                  }
                });
              });
            });
        });
    },
    // //获取已经评教的课程
    // getOkEvaluation() {
    //   //学生id
    //   var stuId = this.studentInfo.userId;
    //   this.ax
    //     .get("/e/findevaluationbyid", {
    //       params: {
    //         id: stuId
    //       }
    //     })
    //     .then(it => {
    //       this.alreadyEvalution = it;
    //     });
    // },
    //进入评教
    entryEvaluation(row) {
      this.tid = row.uid;
      this.$router.push({
        path: "/evaluation/beginEvaluation",
        query: { tid: this.tid, uid: this.uid ,tname:row.username,role:1}
      });
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