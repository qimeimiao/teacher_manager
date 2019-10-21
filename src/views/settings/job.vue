<template>
    <div>
        <List :header="tableHeader" @page="getJob" :data="listData" :page="pageInfo" @delete="deleteItem" @edit="editItem">
            <div slot="top-actions">
                <el-button type="primary" @click="addDialog = true">添加</el-button>
            </div>
        </List>
        <el-dialog title="编辑岗位" :visible.sync="addDialog">
            <el-form label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="addModel.title"></el-input>
                </el-form-item>
                <el-form-item label="岗位描述" >
                    <el-input type="textarea" v-model="addModel.description" placeholder="岗位描述"></el-input>
                </el-form-item>
                <el-form-item label="岗位要求" >
                    <el-input type="textarea" v-model="addModel.requirement" placeholder="岗位要求"></el-input>
                </el-form-item>
                <el-form-item label="福利待遇" >
                    <el-input type="textarea" v-model="addModel.salary" placeholder="福利待遇"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="addDialog = false">取消</el-button>
                <el-button @click="addJob" type="primary" :loading="loading">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import List from "@/components/List";
import ImageInput from "@/components/ImageInput";
import qs from "qs";
export default {
  components: {
    List,
    ImageInput
  },
  data() {
    return {
      addDialog: false,
      loading: false,
      listData: [],
      pageInfo: {},
      addModel: {
        title: null,
        type: 1,
        img: null,
        target: null,
        status: 0,
        sort: 0
      },
      typeMap: ["首页","国际业务", "枫语课堂", "全球外教", "招商推广","公司介绍"],
      statusMap: { 0: "启用", 1: "停用"}
    };
  },
  watch: {
      addDialog (val){
          if (!val) {
              let addModel = this.addModel
              delete addModel.id
              addModel.title = null
              addModel.type = 1
              addModel.img = null
              addModel.target = null
              addModel.status = 0
              addModel.sort = 0
          }
      }
  },
  methods: {
    addJob() {
      let vm = this;
      vm.loading = true;
      let payload = this.addModel;
      this.ax.post("job", qs.stringify(payload)).then(it => {
          if(payload.id){
              vm.listData = vm.listData.map(data => {
                if(data.id === it.id){
                    Object.assign(data,it)
                }
                  return data
              })
          } else {
              vm.listData.unshift(it)
          }
          vm.addDialog = false
          vm.loading = false
      }).catch(()=>{
          vm.loading = false
      });
    },
    getJob(page, size) {
      let vm = this;
      this.ax
        .get("job", {
          params: {
            page: page,
            size: size
          }
        })
        .then(it => {
          vm.listData = it.content
          delete it.content;
          vm.pageInfo = it;
        });
    },
    editItem (item) {
        Object.assign(this.addModel,item)
        this.addDialog = true
    },
    deleteItem(id){
        let vm = this
        this.ax.delete("job/"+id).then(it => {
            vm.listData = vm.listData.filter(it =>{
                  return it.id !== id
              })
        })
    }
  },
  computed: {
    tableHeader() {
      return [
        {
          key: "title",
          name: "岗位名称"
        },
        {
            key: "description",
            name: '岗位描述'
        },
        {
            key: "requirement",
            name: '岗位要求'
        },
        {
            key: 'salary',
            name: '福利待遇'
        },
        {
            key: "createTime",
            name: "创建时间"
        }
      ];
    }
  }
};
</script>
<style scoped>
</style>


