<template>
  <div class="courseManager">
    <div class="courseManager">
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
            <el-button size="mini" type="primary" @click="updateCourse(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="removeCourse(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加科目界面 -->
    <el-dialog :title="'添加科目'" :visible.sync="addCourseMessage">
      <div class="edit_user_main">
        <div>
          <p>科目：</p>
          <el-input type="text" :row="5" v-model="course"></el-input>
        </div>
        <div>
          <p>院系：</p>
          <el-select placeholder="请选择院系" v-model="deptid" >
            <el-option
              v-for="(item,index) in deptData"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div>
          <p>任课老师：</p>

          <el-select placeholder="请选择教师" v-model="tid">
            <el-option
              v-for="(teacher,index) in noCourseTeacherData"
              :key="index"
              :label="teacher.username"
              :value="teacher.userId"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addCourseMessage = false">取 消</el-button>
        <el-button type="primary" @click="submitAddCourse()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改科目界面 -->
    <el-dialog :title="'修改科目'" :visible.sync="updateCourseMessage">
      <div class="edit_user_main">
        <div>
          <p>科目：</p>
          <el-input type="text" :row="5" v-model="course"></el-input>
        </div>
        <div>
          <p>院系：</p>
          <el-select placeholder="请选择院系" v-model="deptid" @change="deptChange()">
            <el-option
              v-for="(item,index) in deptData"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div>
          <p>任课老师：</p>

          <el-select placeholder="请选择教师" v-model="tid" @change="teacherChange">
            <el-option
              v-for="(teacher,index) in noCourseTeacherData"
              :key="index"
              :label="teacher.username"
              :value="teacher.userId"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="updateCourseMessage = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateCourse()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from "element-ui";
import qs from "qs";
export default {
  name: "courseManager",
  data() {
    return {
      courseData: [],
      username: "", //任课教师姓名
      cname: "", //科目
      dept_name: "", //院系
      deptData: [], //院系列表
      noCourseTeacherData: [], //没有排课的老师
      deptid: "", //学院
      tid: "", //教师id
      course: "", //课程
      deptFlag: false, //院系是否更改
      teacherFlag: false, //院系是否更改

      setCourse: {
        dit: "", //选择修改的院系id
        tid: "", //选择修改的教师id
        courseId: ""
      },

      updateCourseMessage: false, //是否显示修改科目界面
      addCourseMessage: false //是否显示添加科目界面
    };
  },
  methods: {
   
    //点击添加
    addCourse() {
      //初始化页面数据，置为空
      this.course = "";
      this.deptid = "";
      this.tid = "";
      this.addCourseMessage = true;
      //获取院系列表
      this.getDeptData();
      this.getNoCourseTeacher();
    },
    // 获取科目列表信息
    getCoursetData() {
      this.ax.post("/cc/findallcourse").then(it => {
        this.courseData = it.dataList;
        console.log(this.courseData);
      });
    },

    //获取院系列表
    getDeptData() {
      this.ax.get("/dept/department").then(it => {
        this.deptData = it.childs;
        console.log(this.deptData);
      });
    },

    //获取没有排课的老师
    getNoCourseTeacher(deptId) {
      this.ax.get("/cc/getNoCourseTeacher",{params:{
        dept_id:deptId
      }}).then(it => {
        this.noCourseTeacherData = it.dataList;
        console.log(it);
      });
    },

    //点击确定添加课程
    submitAddCourse() {
      console.log(this.deptid + " " + this.tid + " " + this.course);

      //课程信息是否填写正确，如果正确则提交数据，如果不正确 做出提示并退出
      if (this.deptid == "" || this.tid == "" || this.course == "") {
        Message({
          message: "请填写正确课程信息",
          type: "warning"
        });
        return;
      }
      let data = {
        cname: this.course,
        uid: this.tid,
        deptid: this.deptid
      };
      this.ax.post("/cc/addcourse", data).then(it => {
        Message({
          message: "添加成功",
          type: "success"
        });
        this.addCourseMessage = false;
        this.getCoursetData();
        this.updateTeacherDept();
      });
    },

    //修改教师院系
    updateTeacherDept(){
      this.ax.get("/cc/updateTeacherDept",{params:{
        dept_id:this.deptid,
        user_id:this.tid,
      }}).then(it=>{
        console.log("部门修改");
      })
    },

    //点击修改按钮
    updateCourse(row) {
      console.log(row);
      this.course = row.cname;
      this.deptid = row.dept_name;
      this.tid = row.username;

      //获取选择的课程的院系id和教师id
      this.setCourse.dit = row.deptid;
      this.setCourse.tid = row.uid;
      this.setCourse.courseId = row.cid;

      //将教师和院系是否更改，初始为没有更改
      this.deptFlag = false;
      this.teacherFlag = false;

      //获取院系列表
      this.getDeptData();
      this.getNoCourseTeacher();
      this.updateCourseMessage = true;
    },

    //确定修改
    submitUpdateCourse() {
      //如果院系没修改，则将初始的院系名改为院系id
      if (this.deptFlag == false) {
        this.deptid = this.setCourse.dit;
      }
      //如果教师没修改，则将初始的教师名改为院系id
      if (this.teacherFlag == false) {
        this.tid = this.setCourse.tid;
      }
      let data = {
        cname: this.course,
        deptid: this.deptid,
        uid: this.tid,
        cid: this.setCourse.courseId
      };
      this.ax.post("/cc/updatecoursebyid", data).then(it => {
        if (it == true) {
          //刷新课程界面
          this.getCoursetData();
          //关闭修改界面
          this.updateCourseMessage = false;
          Message({
            message: "修改成功",
            type: "success"
          });
          this.updateTeacherDept();
        } else {
          Message({
            message: "修改失败，请重试",
            type: "error"
          });
        }
      });
      // console.log(this.deptid+" "+this.tid+" "+this.course)
    },

    //修改院系
    deptChange() {
      this.deptFlag = true;
    },

    //教师修改
    teacherChange() {
      this.teacherFlag = true;
    },

    //删除课程
    removeCourse(row) {
      this.ax.get("/cc/deletecouresbyid",{params:{
        cid:row.cid
      }}).then(it=>{
        if(it==true){
           Message({
            message: "删除成功",
            type: "success"
          });
           //刷新课程界面
          this.getCoursetData();
        }
      })
    }
  },
  created() {},
  mounted() {
    this.getCoursetData();
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