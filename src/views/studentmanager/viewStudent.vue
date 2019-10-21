<template>
  <div class="viewStudent">
    <div class="viewStudent">
      <el-table
        :data=" StudentData"
        style="width: 100%"
      >
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="dName" label="院系"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="removeStudent(scope.row.userId)">删除</el-button>
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
  name: "viewStudent",
  data() {
    return {
      StudentData: [],
      courseData:{},
      username:"",  //姓名
      mobile:"",  //电话
      roleName:"",  //角色
      dName:"",  //院系

      updateEvaluationMessage: false,   //修改题目提示
      evaluation:"",    //输入的题目内容
      updateId:"",   //修改题目的id
      question: "" // 试题内容
    };
  },
  methods: {
    // 获取学生列表信息
    getStudentData() {
      this.ax.get("/user/getUserInfoByRolr",{params:{role:0}}).then(it => {
       
        this. StudentData=it.dataList;
           console.log(this.StudentData);      
      });
    },

    //删除学生   
    removeStudent(sid) {
       console.log(sid);
      let data = {
        userIds: String(sid)
      };
      this.ax
        .post("/user/delete", data)
        .then(it => {
          // 界面数据删除
          this.StudentData.some((item,i)=>{
            if(item.userId==sid){
              this.StudentData.splice(i,1);
              return true;
            }
          })
           Message({
            message: "删除成功",
            type: "success"
          })
        });
    }
  },
  created() {
    
  },
  mounted() {
    this.getStudentData();
    
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.viewStudent{
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