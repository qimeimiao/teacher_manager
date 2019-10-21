<template>
  <div class="userManager" :loading="loading">
    <div class="header">
      <div class="share_input">
        <div>
          <p>用户名：</p>
          <el-input v-model="shareName"></el-input>
        </div>
        <div>
          <p>手机：</p>
          <el-input v-model="shareTelPhone"></el-input>
        </div>
        <div>
          <p>状态：</p>
          <el-select v-model="shareRole" clearable placeholder="请选择">
            <el-option label="锁定" value="0"></el-option>
            <el-option label="有效" value="1"></el-option>
          </el-select>
        </div>
      </div>

      <div class="share_btn">
        <el-button @click="shareBtn()">搜索</el-button>
        <el-button @click="refresh()">刷新</el-button>
        <el-button @click="addUserInfo">新增用户</el-button>
        <el-button type="danger" @click="removeRole()" :disabled="deleteId.length< 1">删除用户</el-button>
      <el-button @click="addDialog=true">导入</el-button>
          <el-button>
            <a href="/manager/user/excel">导出</a>
          </el-button>
      </div>


    </div>

    <div class="userList">
      <el-table
          @select="handleSelectionChange"
          @select-all="handleSelectionChange"
          :data="userData"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            width="80"
            label="头像">
          <template slot-scope="scope">
            <img class="user_avatar" :src="scope.row.avatar || null" alt="">
          </template>
        </el-table-column>
        <el-table-column
            prop="username"
            label="用户名">
        </el-table-column>
        <el-table-column
            label="描述">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.description" placement="top">
              <p class="user_desc">{{scope.row.description}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="联系电话">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱">
        </el-table-column>
        <el-table-column
            label="状态">
          <template slot-scope="scope">
            {{scope.row.status === '0' ? '锁定': '有效'}}
          </template>
        </el-table-column>
        <el-table-column
            sortable
            prop="createDate"
            label="创建时间">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="viewUser(scope.row)">查看</el-button>
            <el-button size="mini" type="primary" @click="editUser(scope.row)">设置</el-button>
            <el-button size="mini" type="danger" @click="removeUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

 <el-dialog :visible.sync="addDialog" :close-on-click-modal="false">
        <el-form>
          <el-form-item label="文件上传">         
         <el-upload
            class="upload-demo"
            ref="upload"
            action="/manager/user/excel"
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


    <el-dialog
        :title="updateOrAddUser?'新建用户':'修改用户信息'"
        :visible.sync="editUserMessage">
      <div class="edit_user_main">
        <div><p>用户名：</p><el-input v-model="username"></el-input></div>
        <div><p>手机：</p><el-input v-model="mobile"></el-input></div>
        <div><p>邮箱：</p><el-input v-model="email"></el-input></div>
        <div>
          <p>角色：</p>
          <el-select v-model="selectRole" multiple placeholder="请选择">
            <el-option
                v-for="(item,index) in userRole"
                :key="index"
                :label="item.roleName"
                :value="item.roleId">
            </el-option>
          </el-select>
        </div>
        <div>
          <p>状态：</p>
          <el-radio-group v-model="status">
            <el-radio :label="'0'">锁定</el-radio>
            <el-radio :label="'1'">有效</el-radio>
          </el-radio-group>
        </div>
        <div><p>描述：</p><el-input type="textarea" :row="5" v-model="description"></el-input></div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserMessage = false">取 消</el-button>
        <el-button type="primary" @click="submitUserInfo()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
        title="用户信息"
        :visible.sync="viewUserMessage">
      <div class="dialog_main">
        <div class="avatar"><img :src="userInfo.avatar || null" alt=""></div>
        <div class="user_message">
          <div><p>用户名：</p>{{userInfo.username || '暂无数据'}}</div>
          <div><p>描述：</p>{{userInfo.description || '暂无数据'}}</div>
          <div><p>手机：</p>{{userInfo.mobile || '暂无数据'}}</div>
          <div><p>邮箱：</p>{{userInfo.email || '暂无数据'}}</div>
          <div><p>创建时间：</p>{{userInfo.createDate || '暂无数据'}}</div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "userManager",
    data(){
      return {
        userData: [],
        loading: false,
        addDialog: false,

        // 搜索
        shareName: '', // 用户名
        shareTelPhone: '',  // 手机
        shareRole: '',  // 状态

        updateOrAddUser: true,  // 修改用户或新建用户状态

        viewUserMessage: false,  // 查看用户信息弹窗
        userInfo: '', // 用户信息
        editUserMessage: false, // 修改用户信息弹窗

        selectRole: [],  // 选择用户角色
        userRole: [],  // 角色列表

        // 新建
        username: '',  // 用户名
        mobile: '',  // 手机
        email: '',  // 邮箱
        status: '', // 状态
        description: '', // 描述

        deleteId: [], // 删除ID列表
      }
    },
    methods:{
      getUserData(){
        this.loading = true;
        this.$axios.get('/manager/user/managerList')
            .then(res =>{
              if(res.data.status === 200){
                this.loading = false;
                this.userData = res.data.body.dataList
              }
            })
      },

      // 删除
      removeRole(){
        this.$confirm('确定删除所选用户？', '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            userIds: String(this.deleteId)
          };
          this.$axios.post('/manager/user/delete',data)
              .then(res =>{
                if(res.data.status === 204){
                  this.$message.success('删除成功');
                  this.getUserData()
                }else {
                  this.$message.error('删除失败,请稍后重试')
                }
              })
        }).catch(() => {

        });
      },

      // 表格多选框
      handleSelectionChange(selection,row){
        this.deleteId = selection.map(res =>{
          return res.userId;
        });
      },

      // 获取角色列表
      getUserRole(){
        this.$axios.get('/manager/role/listuser')
            .then(res =>{
              if(res.data.status === 200){
                this.userRole = res.data.body
              }
            })
      },

      // 搜索
      shareBtn(){
        this.loading = true;
        let data= {
          username: this.shareName,
          mobile: this.shareTelPhone,
          status: this.shareRole
        };
        this.$axios.get('/manager/user/managerList',{params:data})
            .then(res =>{
              if(res.data.status === 200){
                this.loading = false;
                this.userData = res.data.body.dataList
              }
            })
      },

      // 刷新
      refresh(){
        this.userData= [];
        this.getUserData();
      },

      // 提交用户信息
      submitUserInfo(){
        let data ={
          userId: this.updateOrAddUser?null:this.userInfo.userId,
          username: this.username,
          email: this.email,
          mobile: this.mobile,
          status: this.status,
          description: this.description,
          roleId: String(this.selectRole),
        };
        if(this.updateOrAddUser){
          this.$axios.post('/manager/user/add',data)
              .then(res =>{
                if(res.data.status === 204){
                  this.getUserData();
                  this.$message.success('创建成功');
                  this.editUserMessage= false;
                }else {
                  this.$message.warning(res.data.message)
                }
              })
        }else {
          this.$axios.post('/manager/user/update',data)
              .then(res =>{
                if(res.data.status === 204){
                  this.getUserData();
                  this.$message.success('修改成功');
                  this.editUserMessage= false;
                }else {
                  this.$message.warning(res.data.message)
                }
              })
        }
      },

      // 新增用户
      addUserInfo(){
        this.username = '';
        this.email = '';
        this.mobile = '';
        this.status = '';
        this.description = '';
        this.selectRole = '';
        this.selectRole = [];
        this.updateOrAddUser = true;
        this.editUserMessage = true;
      },

      // 修改用户资料
      editUser(val){
        this.userInfo = val;

        this.updateOrAddUser = false;
        this.username = val.username;
        this.mobile = val.mobile;
        this.email = val.email;
        this.status = val.status;
        this.description = val.description;
        this.selectRole = [];
        this.updateOrAddUser = false;
        this.editUserMessage = true;
        if(val.roleId){
          this.selectRole = val.roleId.split(',')
        }
      },

      // 查看用户详细资料
      viewUser(val){
        this.viewUserMessage = true;
        this.userInfo = val;
      },

      // 删除用户
      removeUser(val){
        this.$confirm('确定删除该用户？', '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data={
            userIds: val.userId
          };
          this.$axios.post('/manager/user/delete',data)
              .then(res =>{
                if(res.data.status){
                  this.getUserData();
                  this.$message.success('删除成功')
                }else {
                  this.$message.warning('删除失败')
                }
              });
        }).catch(() => {

        });
      },
    },
    created() {
      this.getUserData();
    },
    mounted() {
      this.getUserRole();
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .userManager{
    .header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .share_input{
        display: flex;
        align-items: center;
        >div{
          display: flex;
          align-items: center;
          &:not(:last-child){
            margin-right: 20px;
          }
          >p{
            flex-shrink: 0;
            margin-right: 15px;
          }
        }
      }
    }

    .userList{
      .user_avatar{
        width: 50px;
        height: 50px;
        object-fit: contain;
      }
      .user_desc{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 300px;
      }
    }

    .edit_user_main{
      padding: 20px 50px 50px;
      >div{
        display: flex;
        align-items: center;
        &:not(:last-child){
          margin-bottom: 15px;
        }
        >p{
          width: 80px;
          flex-shrink: 0;
        }
      }
    }
    .dialog_main{
      display: flex;
      align-items: center;
      padding: 20px 50px 50px;
      .avatar{
        width: 200px;
        height: 200px;
        margin-right: 50px;
        >img{
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .user_message{
        display: flex;
        flex-direction: column;
        height: 200px;
        flex-wrap: wrap;
        >div{
          display: flex;
          align-items: center;
          margin-right: 50px;
          width: 300px;
          >p{
            width: 80px;
          }
        }
      }
    }
  }
  /deep/.el-dialog__wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    .el-dialog{
      margin: unset !important;
      width: 960px;
      .el-dialog__body{
        padding: unset !important;
      }
    }
  }
</style>