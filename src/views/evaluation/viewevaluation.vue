<template>
  <div class="viewEvaluation">
    <div class="viewEvaluation">
      <el-button class="action-button" type="success" @click="open">启动本次评教</el-button>
      <el-table :data="evaluationData" style="width: 100%">
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="question" label="内容"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="updateEvaluation(scope.row.qid,scope.row.question)"
            >修改</el-button>
            <el-button size="mini" type="danger" @click="removeEvaluation(scope.row.qid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="'修改评教题目'" :visible.sync="updateEvaluationMessage">
      <div class="edit_user_main">
        <div>
          <p>题目内容：</p>
          <el-input type="textarea" :row="5" v-model="evaluation"></el-input>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="updateEvaluationMessage = false">取 消</el-button>
        <el-button type="primary" @click="submitEvaluation()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from "element-ui";
import qs from "qs";
export default {
  name: "viewEvaluation",
  data() {
    return {
      evaluationData: [],
      // 新建
      qid: "", //  试题编号
      updateEvaluationMessage: false, //修改题目提示
      evaluation: "", //输入的题目内容
      updateId: "", //修改题目的id
      question: "" // 试题内容
    };
  },
  methods: {
    open() {
      this.$confirm("此操作将开启本次评教, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ax.get("/e/delAllEvaluation").then(it => {
            this.$message({
              type: "success",
              message: "开启本次评教!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消开启本次评教"
          });
        });
    },
    //启动本次评教
    evaluationAction() {
      this.ax.get("/e/delAllEvaluation").then(it => {
        console.log(it);
      });
    },
    // 获取试题
    getEvaluationData() {
      this.ax.post("/evaluation/getQuestion").then(it => {
        this.evaluationData = it.dataList;
        console.log(this.evaluationData);
      });
    },

    //删除试题
    removeEvaluation(qid) {
      console.log(qid);
      this.ax
        .get("/evaluation/deleteQuestionById", {
          params: {
            qid: qid
          }
        })
        .then(it => {
          // 界面数据删除
          this.evaluationData.some((item, i) => {
            if (item.qid == qid) {
              this.evaluationData.splice(i, 1);
              return true;
            }
          });
          Message({
            message: "删除成功",
            type: "success"
          });
        });
    },

    //修改题目
    updateEvaluation(qid, question) {
      this.updateEvaluationMessage = true;
      this.updateId = qid;
      this.evaluation = question;
    },

    //点击确定修改题目
    submitEvaluation() {
      console.log(this.evaluation);
      console.log(this.updateId);
      let data = {
        qid: this.updateId,
        question: this.evaluation
      };
      this.ax.post("/evaluation/updateQuestionById", data).then(it => {
        if (it == true) {
          this.updateEvaluationMessage = false;
          //更改界面数据
          this.evaluationData.some((item, i) => {
            if (item.qid == this.updateId) {
              this.$set(this.evaluationData[i], "question", this.evaluation);
              return true;
            }
          });
        } else {
          Message({
            message: "修改失败，请重试",
            type: "fail"
          });
        }
      });
    }
  },
  created() {},
  activated() {
    this.getEvaluationData();
  },
  mounted() {}
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.viewEvaluation {
  .action-button {
    float: right;
  }
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