<template>
  <div class="beginEvaluation">
    <div class="beginEvaluation" v-if="isnull">暂无评分</div>
    <div class="beginEvaluation" v-if="!isnull">
      <el-card class="box-card" v-for="(item,index) in evaluationData" :key="index">
        <div slot="header" class="clearfix">
          <span>{{item.question}}</span>
        </div>
        <div class="text item">
          <div class="block">
            <span class="demonstration">评分：</span>
            <el-rate
              v-model="score[index]"
              :id="index"
              :colors="colors"
              show-text
              :texts="['极差', '失望', '一般', '满意', '非常满意']"
              @change="scoreChange"
            ></el-rate>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{tname}}</span>
        </div>
        <div class="text item">
          <div class="block">
            <span class="demonstration">总分：{{scoreSum}}</span>
          </div>
        </div>
      </el-card>
    </div>
    <!-- <el-button type="success" plain @click="evaluationSuccess" v-if="isEvaluation">成功按钮</el-button> -->
  </div>
</template>
<script>
import { Message } from "element-ui";
export default {
  name: "beginEvaluation",
  data() {
    return {
      studentInfo: {},
      evaluationData: [], //试题列表
      isnull: false,
      tid: "",
      //   isEvaluation:true,
      tname: "", //教师名字
      scoreSum: "", //总分
      score: [
        { v0: null },
        { v1: null },
        { v2: null },
        { v3: null },
        { v4: null }
      ],
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"] // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
    };
  },
  methods: {
    // 获取教师信息
    getStudentInfo() {
      this.ax.get("/teacher/getTeacherByid").then(it => {
        this.studentInfo = it;
        console.log(this.studentInfo);
        this.tid = this.studentInfo.userId;
        this.findEvaluationbytid();
      });
    },
    //查看教师评价的结果
    findEvaluationbytid() {
      this.ax
        .get("/e/findEvaluationbytid", {
          params: {
            tid: this.tid
          }
        })
        .then(it => {
          //如果该老师被评教，则显示结果，如果没有被评，则显示无成绩
          if (it.dataList == "") {
            this.isnull = true;
            console.log(this.isnull);
          } else {
            //   this.isEvaluation=false
            this.isnull = false;
            console.log(it.dataList);
            //求平均数
            var q0=0;
            var q1=0;
            var q2=0;
            var q3=0;
            var q4=0;
            it.dataList.forEach(element => {
                q0=parseInt(q0)+parseInt(element.qpoint1);
                q1=parseInt(q1)+parseInt(element.qpoint2);
                q2=parseInt(q2)+parseInt(element.qpoint3);
                q3=parseInt(q3)+parseInt(element.qpoint4);
                q4=parseInt(q4)+parseInt(element.qpoint5);
            });
            this.score[0] = q0/it.dataList.length/ 4;
            this.score[1] = q1/it.dataList.length/ 4;
            this.score[2] = q2/it.dataList.length/ 4;
            this.score[3] = q3/it.dataList.length/ 4;
            this.score[4] = q4/it.dataList.length/ 4;
            this.tname = this.studentInfo.username;
            this.scoreSum = (q0+q1+q2+q3+q4)/it.dataList.length;
          }
        });
    },
    //分值发生变化
    scoreChange() {
      //   this.isnull = false;
    },
    // 获取试题
    getEvaluationData() {
      this.ax.post("/evaluation/getQuestion").then(it => {
        this.evaluationData = it.dataList;
        console.log(this.evaluationData);
      });
    }
  },
  created() {},
  mounted() {},
  activated() {
    this.getEvaluationData();
    this.getStudentInfo();
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.beginEvaluation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 10px 50px;
  .el-rate {
    line-height: 3;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
  .clearfix {
    line-height: 2.15;
    font-size: 16px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 43%;
    margin-bottom: 10px;
  }
  .el-button {
    padding: 13px 80px;
    font-size: 20px;
    margin: 20px 49%;
  }
}
</style>