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
        </div>
      </div>

      <el-tree
          :data="menuList"
          show-checkbox
          @node-click="loadNode"
          :props="defaultProps"
          check-strictly
          @check-change="handleNodeClick"
          :filter-node-method="filterNode"
          ref="tree"></el-tree>

    </div>

    <div class="manager_card">
      <div class="title">
        {{addMenuType == true?'新建菜单':'修改菜单'}}
      </div>
      <div class="card_main">
        <div class="menu_input">
          <p class="card_name">上级ID：</p>
          <el-input v-model="menuParent" disabled></el-input>
        </div>
        <div class="menu_input">
          <p class="card_name">名称：</p>
          <el-input v-model="menuName"></el-input>
        </div>

        <div class="menu_check">
          <p class="card_name">类型：</p>
          <el-radio-group v-model="menuType">
            <el-radio :label="0">菜单</el-radio>
            <el-radio :label="1">按钮</el-radio>
          </el-radio-group>
        </div>

        <div class="menu_input" v-if="menuType !== 1">
          <p class="card_name">图标：</p>
          <el-input v-model="menuIcon"></el-input>
        </div>
        <div class="menu_input" v-if="menuType !== 1">
          <p class="card_name">地址：</p>
          <el-input v-model="menuUrl"></el-input>
        </div>
        <div class="menu_input">
          <p class="card_name">权限：</p>
          <el-input v-model="menuPerms"></el-input>
        </div>
        <div class="menu_input" v-if="menuType !== 1">
          <p class="card_name">排序：</p>
          <el-input v-model="menuOrder"></el-input>
        </div>

      </div>
      <div class="card_bottom">
        <el-button type="primary" @click="submitBtn">保存</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "menuManager",
    data(){
      return {
        loading: false,
        searchInput: '', // 列表搜索框

        checkList: [],  // 选中的列表
        unCheckList: '', // 取消选中的列表

        menuList: [],  // 列表数据
        defaultProps:{  // 默认字段名
          children: 'childs',
          label: 'title'
        },
        count: 1,

        addMenuType: true,  // 新建菜单状态

        // 默认
        menuId: '', // 按钮ID
        menuParent: 0,  // 上级ID
        menuName: '', // 名称
        menuType:'',  // 类型
        menuIcon:'',  // 图标
        menuUrl: '', // 地址
        menuPerms: '',  // 权限
        menuOrder: '',  // 排序

        menuParentId: '',  // 选中状态下上级ID
      }
    },
    created(){
      this.getMenuList()
    },
    watch: {
      searchInput(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods:{
      getMenuList(){
        this.loading = true;
        this.$axios.get('manager/menu/tree')
            .then(res =>{
              console.log(res);
              if(res.data.status === 200){
                this.loading = false;
                this.menuList = res.data.body.childs
              }
            })
      },

      // 搜索
      filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },

      // 刷新按钮
      refresh(){
        this.getMenuList();
        this.addMenuType = true;
        this.menuParent = 0;
        this.menuName = '';
        this.menuType = '';
        this.menuIcon = '';
        this.menuUrl = '';
        this.menuPerms = '';
        this.menuOrder = '';
      },

      // 添加列表
      addMenu(){
        console.log(this.checkList.length);
        if(this.checkList.length === 1){
          this.menuParent = this.menuParentId;
        }else if(this.checkList.length < 1){
          this.menuParent = 0;
        }else {
          this.$message.warning('只能选择一个节点作为父级')
        }
        this.addMenuType = true;
        this.menuName = '';
        this.menuType = '';
        this.menuIcon = '';
        this.menuUrl = '';
        this.menuPerms = '';
        this.menuOrder = '';
      },

      // 删除
      removeMenu(){
        this.$confirm('当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            menuIds: String(this.checkList)
          };
          this.$axios.post('/manager/menu/delete',data)
              .then(res =>{
                console.log(res.status);
                if(res.status === 200){
                  this.getMenuList()
                  this.$message.success('删除成功')
                }else {
                  this.$message.warning('删除失败，请重试')
                }
              })
        }).catch(() => {

        });;
      },

      // 选择列表
      handleNodeClick(data, checked, indeterminate){
        if(checked){
          this.checkList.push(data.data.menuId)
          this.menuParentId = data.data.parentId
        }else if(!checked){
          for(let i = 0; i < this.checkList.length; i++) {
            if(this.checkList[i] === data.data.menuId) {
              if (i > -1) {
                this.checkList.splice(i, 1);
              }
            }
          }
        }
      },

      // 保存按钮
      submitBtn(){
        let data ={
          menuId: this.menuId,
          parentId: this.menuParent,
          menuName: this.menuName,
          type: this.menuType,
          url: this.menuUrl,
          perms: this.menuPerms,
          icon: this.menuIcon,
          orderNum: this.menuOrder
        };

        let urlType;
        let typeMessage;
        if(this.addMenuType){
          urlType = 'add';
          typeMessage = '添加成功'
        }else {
          urlType = 'edit';
          typeMessage = '修改成功'
        }
        this.$axios.post('/manager/menu/'+urlType,data)
            .then(res =>{
              if(res.status === 200){
                this.$message.success(typeMessage)
                this.getMenuList()
              }else {
                this.$message.warning('数据错误，请稍后重试')
              }
            })

      },

      // 点击列表获取data
      loadNode(data){
        this.addMenuType = false;
        let menuData = data.data;
        this.menuId = menuData.menuId;
        this.menuName = menuData.menuName;
        this.menuType = parseInt(menuData.type);
        this.menuIcon = menuData.icon;
        this.menuUrl = menuData.url;
        this.menuPerms = menuData.perms;
        this.menuOrder = menuData.orderNum;
        this.menuParent = parseInt(menuData.parentId);
      }

    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .menuManager{
    display: flex;
    flex: 2;
    .menu_list{
      flex: 1;
      .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
        .search{
          display: flex;
          align-items: center;
          >p{
            flex-shrink: 0;
            margin-right: 15px;
          }
        }
        .setting_btn{
          display: flex;
          align-items: center;
        }
      }
      .list_main{
        display: flex;
        flex-direction: column;
        /deep/.el-checkbox{
          margin: 0;
        }
      }
    }
    .manager_card{
      flex: 1;
      margin-left: 10%;
      .title{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #dedede;
        padding: 10px 0;
        margin-bottom: 15px;
      }
      .card_main{
        >div{
          display: flex;
          align-items: center;
          >p{
            flex-shrink: 0;
            width: 70px;
            text-align: right;
            margin-right: 15px;
          }
        }
      }
      .card_bottom{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 10px 0;
      }

    }
  }
</style>