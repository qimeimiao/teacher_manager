<template>
  <div class="dashboard-container">
    <!-- <div>数据一个小时更新一次</div> -->
    <el-row v-if="data.user">
      <el-col :lg="4" :md="12">
        <el-card shadow="hover">
          <div>用户</div>
          <div>
            <div>
              总计
              <span class="number" style>{{data.user.total}}</span>
            </div>
            <div>
              今日新增
              <span class="number">{{data.user.today}}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="4" :md="12">
        <el-card shadow="hover">
          <div>用户反馈</div>
          <div>
            <div>
              总计
              <span class="number" style>{{data.opinionBack.total}}</span>
            </div>
            <div>
              今日新增
              <span class="number">{{data.opinionBack.today}}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="4" :md="12">
        <el-card shadow="hover">
          <div>订单</div>
          <div>
            <div>
              总计
              <span class="number" style>{{data.order.total}}</span>
            </div>
            <div>
              今日新增
              <span class="number">{{data.order.today}}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="4" :md="12">
        <el-card shadow="hover">
          <div>用户提交的申请项目</div>
          <div>
            <div>
              总计
              <span class="number" style>{{data.project.total}}</span>
            </div>
            <div>
              今日新增
              <span class="number">{{data.project.today}}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="4" :md="12">
        <el-card shadow="hover">
          <div>已发布项目</div>
          <div>
            <div>
              总计
              <span class="number" style>{{data.publicProject.total}}</span>
            </div>
            <div>
              今日新增
              <span class="number">{{data.publicProject.today}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      data: {}
    };
  },

  created() {
    this.getData();
  },
  mounted() {},

  methods: {
    getData() {
      let vm = this;
      this.ax.get("dashboard").then(it => {
        vm.data = it;
      });
    }
  }
};
</script>

<style scoped>
.el-col {
  padding: 0.6rem;
}
.number {
  font-size: 2rem;
  padding: 0 0.8rem;
}
</style>
