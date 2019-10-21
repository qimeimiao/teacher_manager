<template>
  <div class="menuManager" v-loading="loading">
    <div class="menu_list">
      <div class="title">
        <div class="search">
          <p>名称</p>
          <el-input v-model="searchInput"></el-input>
        </div>
        <div class="setting_btn">
          <el-button @click="refresh">刷新</el-button>
          <el-button @click="addMenu">添加</el-button>
          <el-button @click="removeMenu" :disabled="checkList == ''">删除</el-button>
          <el-button @click="addDialog=true">导入</el-button>
          <el-button>
            <a href="/manager/dept/excel">导出</a>
          </el-button>
        </div>
      </div>

      <el-tree
        :data="deptList"
        show-checkbox
        @node-click="loadNode"
        :props="defaultProps"
        check-strictly
        @check-change="handleNodeClick"
        :filter-node-method="filterNode"
        ref="tree"
      ></el-tree>

      <el-dialog :visible.sync="addDialog" :close-on-click-modal="false">
        <el-form>
          <el-form-item label="文件上传">         
         <el-upload
            class="upload-demo"
            ref="upload"
            action="/manager/dept/excel"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="updateSuccess"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >上传到服务器</el-button>
             <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
          </el-upload>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button @click="addDialog = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="manager_card">
      <div class="title">{{addMenuType == true?'新增部门':'修改部门'}}</div>
      <div class="card_main">
        <div class="menu_input">
          <p class="card_name">上级ID：</p>
          <el-input v-model="parentId" disabled></el-input>
        </div>
        <div class="menu_input">
          <p class="card_name">名称：</p>
          <el-input v-model="deptName"></el-input>
        </div>
        <div class="menu_input">
          <p class="card_name">排序：</p>
          <el-input v-model="orderNum"></el-input>
        </div>
      </div>
      <div class="card_bottom">
        <el-button type="primary" @click="submitBtn">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ImageInput from "@/components/ImageInput";

export default {
  components: {
    ImageInput
  },
  name: "deptManager",
  data() {
    return {
      loading: false,
      searchInput: "", // 列表搜索框
      addDialog: false,
      checkList: [], // 选中的列表
      unCheckList: "", // 取消选中的列表

      deptList: [], // 列表数据
      defaultProps: {
        // 默认字段名
        children: "childs",
        label: "title"
      },
      count: 1,

      addMenuType: true, // 新建部门状态

      // 默认
      deptId: "", // 按钮ID
      parentId: 0, // 上级ID
      deptName: "", // 名称
      orderNum: "", // 排序

      deptParentId: "" // 选中状态下上级ID
    };
  },
  created() {
    this.getDeptList();
  },
  watch: {
    searchInput(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    getDeptList() {
      this.loading = true;
      this.$axios.get("manager/dept/department").then(res => {
        console.log(res);
        if (res.data.status === 200) {
          this.loading = false;
          this.deptList = res.data.body.childs;
          console.log(this.deptList);
        }
      });
    },

    // 搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },

    // 刷新按钮
    refresh() {
      this.getDeptList();
      this.addMenuType = true;
      this.parentId = 0;
      this.deptId = "";
      this.deptName = "";
      this.orderNum = "";
    },

    // 添加列表
    addMenu() {
      console.log(this.checkList.length);
      if (this.checkList.length === 1) {
        this.parentId = this.deptParentId;
      } else if (this.checkList.length < 1) {
        this.parentId = 0;
      } else {
        this.$message.warning("只能选择一个节点作为父级");
      }
      this.addMenuType = true;
      this.deptName = "";
      this.orderNum = "";
    },

    // 删除
    removeMenu() {
      this.$confirm(
        "当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let data = {
            deptIds: String(this.checkList)
          };
          this.$axios.post("/manager/menu/delete", data).then(res => {
            console.log(res.status);
            if (res.status === 200) {
              this.getDeptList();
              this.$message.success("删除成功");
            } else {
              this.$message.warning("删除失败，请重试");
            }
          });
        })
        .catch(() => {});
    },

    exportExcel() {
      // let {sortedInfo} = this
      // let sortField, sortOrder
      // // 获取当前列的排序和列的过滤规则
      // if (sortedInfo) {
      //   sortField = sortedInfo.field
      //   sortOrder = sortedInfo.order
      // }
      this.ax.get("/dept/excel");
    },

    // 选择列表
    handleNodeClick(data, checked, indeterminate) {
      if (checked) {
        this.checkList.push(data.data.deptId);
        this.deptParentId = data.data.deptId;
      } else if (!checked) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i] === data.data.deptId) {
            if (i > -1) {
              this.checkList.splice(i, 1);
            }
          }
        }
      }
    },

    // 保存按钮
    submitBtn() {
      let data = {
        deptId: this.deptId,
        parentId: this.parentId,
        deptName: this.deptName,
        orderNum: this.orderNum
      };

      let urlType;
      let typeMessage;
      if (this.addMenuType) {
        urlType = "add";
        typeMessage = "添加成功";
      } else {
        urlType = "edit";
        typeMessage = "修改成功";
      }
      this.$axios.post("/manager/menu/" + urlType, data).then(res => {
        if (res.status === 200) {
          this.$message.success(typeMessage);
          this.getDeptList();
        } else {
          this.$message.warning("数据错误，请稍后重试");
        }
      });
    },

    // 点击列表获取data
    loadNode(data) {
      this.addMenuType = false;
      let deptData = data.data;
      this.deptId = deptData.deptId;
      this.deptName = deptData.deptName;
      this.menuOrder = deptData.orderNum;
      this.deptParent = parseInt(deptData.parentId);
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.menuManager {
  display: flex;
  flex: 2;
  .menu_list {
    flex: 1;
    .title {
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
    .list_main {
      display: flex;
      flex-direction: column;
      /deep/.el-checkbox {
        margin: 0;
      }
    }
  }
  .manager_card {
    flex: 1;
    margin-left: 10%;
    .title {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dedede;
      padding: 10px 0;
      margin-bottom: 15px;
    }
    .card_main {
      > div {
        display: flex;
        align-items: center;
        > p {
          flex-shrink: 0;
          width: 70px;
          text-align: right;
          margin-right: 15px;
        }
      }
    }
    .card_bottom {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px 0;
    }
  }
}
</style>