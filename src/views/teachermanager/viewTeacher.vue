<template>
  <div class="viewTeacher">
    <div class="viewTeacher">
      <el-table
        :data="teacherData"
        style="width: 100%"
      >
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="dName" label="院系"></el-table-column>
        <el-table-column prop="course" label="科目"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="removeTeacher(scope.row.userId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import { Message,MessageBox } from "element-ui";
import qs from "qs";
export default {
  name: "viewTeacher",
  data() {
    return {
      teacherData: [],
      courseData:{},
      username:"",  //姓名
      mobile:"",  //电话
      roleName:"",  //角色
      dName:"",  //院系
      course:"",  //科目

      updateEvaluationMessage: false,   //修改题目提示
      evaluation:"",    //输入的题目内容
      updateId:"",   //修改题目的id
      question: "" // 试题内容
    };
  },
  methods: {
    // 获取教师列表信息
    getTeacherData() {
      this.ax.get("/user/getUserInfoByRolr",{params:{role:1}}).then(it => {
       
        this.teacherData=it.dataList;
        //给teacherData添加course字段
        this.teacherData = it.dataList.map(i => {
           this.$set(i,"course","")
            return i
          })
           console.log(this.teacherData);
        //获取教师科目
        this.ax.post("/user/getCourse").then(it=>{     
        this.courseData=it.dataList;        
        //将教师的科目添加到teacherData数组
        this.teacherData.forEach((e,i) => {
          this.courseData.forEach((e,j)=>{
            if(this.teacherData[i].userId==this.courseData[j].uid){
              this.teacherData[i].course=this.courseData[j].cname;
            }
          })
          
        });
      })
        
       
      });
    },

    //删除教师  
    removeTeacher(tid) {
      console.log(tid);
      let data = {
        userIds: String(tid)
      };
      this.ax
        .post("/user/delete", data)
        .then(it => {
          // 界面数据删除
          this.teacherData.some((item,i)=>{
            if(item.userId==tid){
              this.teacherData.splice(i,1);
              return true;
            }
          })
           Message({
            message: "删除成功",
            type: "success"
          })
        });
    },
  },
  created() {
    
  },
  mounted() {
    
  },
  activated(){
    this.getTeacherData();   
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.viewTeacher {
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