<template>
  <div>
    <List
      :header="tableHeader"
      @page="getBanner"
      :data="listData"
      :page="pageInfo"
      @delete="deleteItem"
      @edit="editItem"
      extraAction="设置权限"
      @extraAction="setPermission"
      :disableEdit="true"
    >
      <div slot="top-actions">
        <el-button type="primary" @click="addDialog = true">添加</el-button>
      </div>

      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <router-link :to="'/system/permission?userId='+scope.row.userId">
            <el-button>设置权限</el-button>
          </router-link>
          <router-link :to="'/project/updateProjectDetail?id='+scope.row.id">
            <el-button type="primary">编辑</el-button>
          </router-link>
          <router-link :to="'/project/updateProjectDetail?id='+scope.row.id">
            <el-button type="primary">删除</el-button>
          </router-link>
        </template>
      </el-table-column>
    </List>
    <el-dialog title="编辑管理员" :visible.sync="addDialog">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="addModel.username" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addModel.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addModel.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button @click="addBanner" type="primary" :loading="loading">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import List from "@/components/List";
import ImageInput from "@/components/ImageInput";
import DeleteButton from "@/components/DeleteButton";
import qs from "qs";
export default {
  components: {
    List,
    ImageInput,
    DeleteButton
  },
  data() {
    return {
      addDialog: false,
      loading: false,
      listData: [],
      pageInfo: {},
      addModel: {},
      statusMap: { 0: "启用", 1: "停用" }
    };
  },
  watch: {
    addDialog(val) {
      if (!val) {
        let addModel = this.addModel;
        addModel = {};
      }
    }
  },
  methods: {
    setPermission(row) {
      this.$router.push({
        name: "permission",
        params: { userId: row.userId },
        query: { userId: row.id }
      });
    },
    addBanner() {
      let vm = this;
      vm.loading = true;
      let payload = this.addModel;
      this.ax
        .post("/user/add", this.addModel)
        .then(it => {
          console.log(it);
          this.getBanner();
          vm.addModel = {};
          vm.addDialog = false;
          vm.loading = false;
        })
        .catch(() => {
          vm.loading = false;
        });
    },
    getBanner(page, size) {
      let vm = this;
      this.ax
        .get("/user/managerList", {
          params: {
            page: page,
            size: size
          }
        })
        .then(it => {
          let status = {
            0: "锁定",
            1: "有效"
          };
          vm.listData = it.dataList.map(it => {
            it.statusName = status[it.status];
            // it.typeName = vm.typeMap[it.type-1];
            return it;
          });
          delete it.dataList;
          vm.pageInfo = it;
        });
    },
    editItem(item) {
      this.addModel.username = item.mobile;
      this.addModel.id = item.id;
      // Object.assign(this.addModel,item)
      this.addDialog = true;
    },
    deleteItem(item) {
      console.log(item);

      let vm = this;
      this.ax.delete("manager/" + item).then(it => {
        vm.listData = vm.listData.filter(bi => {
          bi.loading = false;
          return item.id !== bi.id;
        });
        vm.$forceUpdate();
      });
    }
  },
  computed: {
    tableHeader() {
      return [
        {
          key: "username",
          name: "用户名"
        },
        {
          key: "mobile",
          name: "手机号"
        },
        {
          key: "createDate",
          name: "创建时间"
        }
      ];
    }
  }
};
</script>
<style scoped>
</style>


