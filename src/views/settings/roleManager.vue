<template>
  <div class="roleManager" :loading="loading">
    <div class="role_table">
      <div class="table_header">
        <div class="search">
          <p>名称</p>
          <el-input v-model="searchInput"></el-input>
        </div>
        <div class="setting_btn">
          <el-button @click="searchTable">搜索</el-button>
          <el-button @click="refresh">刷新</el-button>
          <el-button @click="addRole">添加</el-button>
          <el-button @click="removeRole" :disabled="this.deleteId.length < 1">删除</el-button>
        </div>
      </div>
      <el-table
        :data="roleData"
        @select="handleSelectionChange"
        @select-all="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="remark" label="角色描述"></el-table-column>
        <el-table-column prop="createDate" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div class="operating">
              <el-button icon="el-icon-setting" type="primary" @click="editRoleList(scope.row)"></el-button>
              <el-button icon="el-icon-delete" type="danger" @click="removeRoleList(scope.row)"></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="role_form">
      <div class="title">{{showAddForm?'新增角色':'修改角色'}}</div>
      <div class="form_main">
        <div>
          <p>角色名称：</p>
          <el-input v-model="roleName"></el-input>
        </div>
        <div>
          <p>角色描述：</p>
          <el-input type="textarea" :rows="5" v-model="roleDesc"></el-input>
        </div>

        <div class="form_tree">
          <p>角色权限：</p>
          <el-tree
            node-key="id"
            :default-checked-keys="menuIds"
            :loading="treeLoading"
            :data="menuList"
            show-checkbox
            @node-click="loadNode"
            @check-change="handleNodeClick"
            :props="defaultProps"
            check-strictly
            ref="tree"
          ></el-tree>
        </div>
      </div>

      <div class="form_bottom">
        <el-button type="primary" @click="submitBtn" :loading="loading">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "roleManager",
  data() {
    return {
      loading: false,
      treeLoading: false,
      searchInput: "", // 搜索框
      roleData: [], // 角色列表

      deleteId: [], // 删除ID

      showAddForm: true,

      roleId: "", // 角色ID
      roleName: "", // 角色名称
      roleDesc: "", // 角色描述
      menuIds: [], // 权限ID

      menuList: [], // 权限列表
      defaultProps: {
        // 默认字段名
        children: "childs",
        label: "title"
      }
    };
  },
  methods: {
    // 获取角色列表
    getRoleData() {
      this.loading = true;
      this.$axios.get("/manager/role/listuser").then(res => {
        if (res.data.status === 200) {
          this.loading = false;
          this.roleData = res.data.body;
        }
      });
    },

    // 获取权限列表
    getMenuList() {
      this.treeLoading = true;
      this.$axios.get("manager/menu/tree").then(res => {
        if (res.data.status === 200) {
          this.treeLoading = false;
          this.menuList = res.data.body.childs;
        }
      });
    },

    // 搜索
    searchTable() {
      this.treeLoading = true;
      let data = {
        roleName: this.searchInput
      };
      this.$axios.get("/manager/role/listuser", { params: data }).then(res => {
        if (res.data.status === 200) {
          this.loading = false;
          this.roleData = res.data.body;
        }
      });
    },

    // 刷新
    refresh() {
      this.menuIds = []; //1
      this.searchInput = "";
      this.getRoleData();
      this.getMenuList();
    },

    // 添加
    addRole() {
      this.menuIds = []; //1
      this.showAddForm = true;
      this.roleName = "";
      this.roleDesc = "";
      this.$refs.tree.setCheckedNodes([]);
    },

    // 删除
    removeRole() {
      this.$confirm("确定删除所选角色？", "删除角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            roleIds: String(this.deleteId)
          };
          this.$axios.post("/manager/role/delete", data).then(res => {
            if (res.data.status === 204) {
              this.$message.success("删除成功");
              this.getRoleData();
            } else {
              this.$message.error("删除失败,请稍后重试");
            }
          });
        })
        .catch(() => {});
    },

    // 表格多选框
    handleSelectionChange(selection, row) {
      this.deleteId = selection.map(res => {
        return res.roleId;
      });
    },

    // 修改
    editRoleList(val) {
      this.menuIds = []; //1
      this.$refs.tree.setCheckedNodes([]);

      this.showAddForm = false;
      this.roleId = val.roleId;
      this.roleName = val.roleName;
      this.roleDesc = val.remark;
      this.menuIds = val.menuIds.split(",");
    },

    // 列表按钮删除
    removeRoleList(val) {
      this.$confirm("确定删除所选角色？", "删除角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            roleIds: val.roleId
          };
          this.$axios.post("/manager/role/delete", data).then(res => {
            if (res.data.status === 204) {
              this.getRoleData();
              this.$message.success("删除成功");

              this.menuIds = [];
              this.showAddForm = true;
              this.roleName = "";
              this.roleDesc = "";
              this.$refs.tree.setCheckedNodes([]);
            } else {
              this.$message.error("删除失败,请稍后重试");
            }
          });
        })
        .catch(() => {});
    },

    // 点击列表获取data
    loadNode(data) {},

    // 选择列表
    handleNodeClick(data, checked, indeterminate) {
      if (checked) {
        this.menuIds.push(data.data.menuId);
      } else if (!checked) {
        for (let i = 0; i < this.menuIds.length; i++) {
          if (this.menuIds[i] === data.data.menuId) {
            if (i > -1) {
              this.menuIds.splice(i, 1);
            }
          }
        }
      }
    },
       // 保存
      submitBtn(){
        this.loading = true
        // console.log(String(this.menuIds));
        if(this.showAddForm){
          let data = {
            roleName:this.roleName,
            remark:this.roleDesc,
            menuIds: String(this.menuIds)
          };
            if(this.roleName && this.roleDesc && String(this.menuIds)){
              this.ax.post('role/add',data)
                  .then(res =>{
          
                      this.getRoleData();
                      this.$message.success('添加成功')
                      this.roleName = '';
                      this.roleDesc = '';
                      this.$refs.tree.setCheckedNodes([]);
                      this.menuIds = [];
                      this.loading = false
                  })
            } else {
              this.$message.warning('信息不完整')
            }



        } else {
          let data = {
            roleId: this.roleId,
            roleName:this.roleName,
            remark:this.roleDesc,
            menuIds: String(this.menuIds)
          };
          this.ax.post('role/update',data)
              .then(res =>{
            
                  this.getRoleData();
                  this.menuIds = [];
                  this.loading = false
                  this.$message.success('修改成功')
              })
        }
      },
    },
  
  created() {
    this.getRoleData();
    this.getMenuList();
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.roleManager {
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