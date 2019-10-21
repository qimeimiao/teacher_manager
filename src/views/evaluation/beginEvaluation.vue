<template>
  <div class="beginEvaluation">
    <div class="beginEvaluation">
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
      <el-card class="box-card" v-if="!isEvaluation">
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
    <el-button type="success" plain @click="evaluationSuccess" v-if="isEvaluation">成功按钮</el-button>
  </div>
</template>
<script>
import { Message } from "element-ui";
export default {
  name: "beginEvaluation",
  data() {
    return {
      evaluationData: [], //试题列表
      isnull: false,
      isEvaluation:true,
      tname:"",   //教师名字
      scoreSum:"",   //总分
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
    //查看给教师评价的结果
    findEvaluationbyuidandtid(){
      var tid = this.$route.query.tid;
      var uid = this.$route.query.uid;
      let data={
        tid: tid,
        uid: uid,
      }
      this.ax.post("/e/findEvaluationbyuidandtid",data).then(it=>{
        //如果该老师被评教，则显示结果，如果没有被评，则可以评教
        if(it==undefined){
          this.isEvaluation=true
        }else{
          this.isEvaluation=false
          console.log(it);
          this.score[0]=it.qpoint1/4;
          this.score[1]=it.qpoint2/4;
          this.score[2]=it.qpoint3/4;
          this.score[3]=it.qpoint4/4;
          this.score[4]=it.qpoint5/4;
          this.tname=this.$route.query.tname;
          this.scoreSum=it.point;
        }
      })
    },
    //提交评教
    evaluationSuccess() {
      this.isnull == false;
      var myScore = [];
      var scoreSum = 0;
      //循环score，将数据插入到myScore表,并将每个分值乘4
      this.score.forEach(item => {
        myScore.push(item * 4);
      });
      //判断是否完成所有评教
      myScore.forEach(item => {
        if (JSON.stringify(item) == "null") {
          Message({
            message: "请完成所有的评教内容",
            type: "warning"
          });
          this.isnull = true;
        }
        scoreSum = scoreSum + item;
      });
      //当完成了所有评教时，则将数据提交到后台
      if (this.isnull == false) {
        console.log(scoreSum);
        //将分数提交到数据库
        var tid = this.$route.query.tid;
        var uid = this.$route.query.uid;
        console.log(tid + " " + uid);
        let data = {
          tid: tid,
          uid: uid,
          point: scoreSum,
          qpoint1: myScore[0],
          qpoint2: myScore[1],
          qpoint3: myScore[2],
          qpoint4: myScore[3],
          qpoint5: myScore[4]
        };
        // console.log(data);
        // return;
        this.ax.post("/e/insertEvluation", data).then(it => {
          if (it == true) {
            var role=this.$route.query.role;
            if(role==0){
              this.$router.push({ name: "studentEvaluation" });
            }else if(role==1){
              this.$router.push({ name: "teachErvaluation" });
            }
            
          }else{
            Message({
            message: "评教失败，请重试",
            type: "error"
          });
          }
        });
      }
    },
    //分值发生变化
    scoreChange() {
      this.isnull = false;
    },
    // 获取试题
    getEvaluationData() {
      
      this.ax.post("/evaluation/getQuestion").then(it => {
        this.evaluationData = it.dataList;
        console.log(this.evaluationData);
      });
    }
  },
  created() {
    console.log(this.$route.query.isEvaluation);
    this.getEvaluationData();
   
  },
  mounted(){
 
  },
  activated(){
    this.findEvaluationbyuidandtid();
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