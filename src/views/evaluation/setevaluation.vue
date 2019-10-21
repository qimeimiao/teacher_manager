<template>
  <div class="setevaluation">
    <div class="role_form">
      <div class="title">添加评教 您还可以添加{{5-evaluationCount}}道题</div>
      <br />
      <div class="form_main">
        <div>
          <p>评教内容：</p>
          <el-input type="textarea" :rows="5" v-model="evItem.question" name="question"></el-input>
        </div>
      </div>
      <div class="form_bottom">
        <el-button type="primary" @click="submitBtn">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "setevaluation",
  data() {
    return {
      evItem: {},
      evaluationCount: "" //评教题目数量
    };
  },
  methods: {
    // 保存
    submitBtn() {
      // let data = {
      //   question: this.evItem
      // };
      // console.log(this.evItem);
      let vm = this;
      //添加的评教内容小于5
      if (vm.evaluationCount < 5) {
        this.ax
          .post("/evaluation/addEvaluation", vm.evItem)
          .then(it => {
            //如果添加成功
            if (it == true) {
              // console.log(it.data.body);
              this.evaluationCount++;
              Message({
                message: "评教内容添加成功",
                type: "success"
              });
              //清空界面评教内容
              this.evItem.question = "";
            }
          })
          .catch(() => {
            Message({
              message: "添加失败",
              type: "fail"
            });
          });
      }else{
         Message({
              message: "您不能再添加评教题目",
              type: "warning"
            });
        //清空界面评教内容
        this.evItem.question = "";  
      }
    },

    //查询题目数量
    getQuestionCount() {
      this.ax.post("/evaluation/getQuestionCount").then(it => {
        this.evaluationCount = it;
      });
    }
  },
  created() {
    
  },
  activated(){
    this.getQuestionCount();
    
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.setevaluation {
  display: flex;
  justify-content: space-between;
  flex: 2;
  .role_table {
    flex: 1;
    .table_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      .search {
        display: flex;
        align-items: center;
        > p {
          flex-shrink: 0;
          margin-right: 15px;
        }
      }
      .setting_btn {
        display: flex;
        align-items: center;
      }
    }
  }
  .role_form {
    flex: 1;
    margin-left: 10%;
    .title {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dedede;
      padding: 10px 0;
      margin-bottom: 15px;
    }
    .form_main {
      > div {
        display: flex;
        align-items: center;
        &:not(:last-child) {
          margin-bottom: 20px;
        }
        > p {
          flex-shrink: 0;
          width: 90px;
          text-align: right;
          margin-right: 15px;
        }
      }
      .form_tree {
      }
    }
    .form_bottom {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px 0;
    }
  }
}
</style>