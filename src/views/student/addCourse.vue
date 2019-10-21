<template>
  <div class="courseManager">
    <div class="courseManager">
      <el-transfer
        style="text-align: left; display: inline-block;height: 500px;"
        v-model="value"
        :data="data"
        :titles="['所有课程', '我的课程']"
        @change="handleChange"
      ></el-transfer>
    </div>
    <div>
      <el-button type="primary" @click="addCourse()">添加课程</el-button>
    </div>
  </div>
</template>

<script>
import { Message, MessageBox } from "element-ui";
export default {
  data() {
    return {
      studentInfo: {}, //学生信息
      data: [],
      value: [],
      courseList: []
    };
  },
  methods: {
    // 获取学生信息
    getStudentInfo() {
      this.ax.get("/teacher/getTeacherByid").then(it => {
        this.studentInfo = it;
        console.log(this.studentInfo);
        this.getCourse();
      });
    },
    // //获取课程列表
    // getCourse() {
    //   this.data = [];
    //   this.value = [];
    //   this.ax.post("/cc/findallcourse").then(it => {
    //     console.log(it.dataList);
    //     it.dataList.forEach((course, index) => {
    //       this.data.push({
    //         label: course.cname,
    //         key: course.cid
    //         // key: course.cname
    //       });
    //     });
    //   });
    // },
    //获取课程列表
    getCourse() {
      //学生id
      var stuId = this.studentInfo.userId;
      this.data = [];
      this.value = [];
      this.ax
        .get("/user/sut/getNotSelectCourse", {
          params: {
            uid: stuId
          }
        })
        .then(it => {
          console.log(it);
          it.dataList.forEach((course, index) => {
            this.data.push({
              label: course.cname,
              key: course.cid
              // key: course.cname
            });
          });
        });
    },
    handleChange(value, direction) {
      this.courseList.push(value);
    },
    //添加课程
    addCourse() {
      if (this.courseList.length == 0) {
        Message({
          message: "您没有添加的课程",
          type: "warning"
        });
        return;
      } else {
        //学生id
        var stuId = this.studentInfo.userId;
        var len = this.courseList.length - 1;
        //课程数组
        var clist = this.courseList[len];
        this.addcourseList(clist, stuId);
        // //删除该用户所有课程
        // this.ax
        //   .get("/user/sut/delCourseStudentById", {
        //     params: {
        //       uid: stuId
        //     }
        //   })
        //   .then(it => {
        //     console.log(it);
        //     this.addcourseList(clist, stuId);
        //   });
      }
    },
    //添加课程
    addcourseList(clist, stuId) {
      //遍历课程数组，逐条添加到数据库
      clist.forEach(item => {
        console.log(item);
        let data = {
          uid: stuId,
          cid: item
        };
        console.log(data);
        this.ax.post("/user/sut/addCourseStudent", data).then(it => {
          console.log(it);
          this.courseList = [];
          this.$router.push({ path: "/student/myCourse" });
        });
      });
    }
  },

  activated() {
    // this.getCourse();
    this.getStudentInfo();
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.courseManager {
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