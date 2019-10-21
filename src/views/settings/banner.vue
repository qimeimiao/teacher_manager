<template>
    <div>
        <List :header="tableHeader" @page="getBanner" :data="listData" :page="pageInfo" @delete="deleteItem" @edit="editItem">
            <div slot="top-actions">
                <el-button type="primary" @click="addDialog = true">添加</el-button>
            </div>
            <el-table-column label="图片" slot="before">
                 <template slot-scope="scope">
                     <img v-bind:src="scope.row.cover" alt=""  style="max-width:10em">
                </template>
            </el-table-column>
                <div slot="filters">
                    <el-input v-model="filter.name" placeholder="标题" style="width:auto" clearable></el-input>
                    <el-select v-model="filter.status">
                    <el-option label="全部状态" :value="null"></el-option>
                    <el-option label="启用" :value="0"></el-option>
                    <el-option label="停用" :value="1"></el-option>
                </el-select>
                    <el-select v-model="filter.type">
                    <el-option label="全部位置" :value="null"></el-option>
                    <el-option :label="item" :value="index+1" v-for="(item,index) in typeMap" :key="item"></el-option>
                </el-select>
                <el-button type="primary" @click="getBanner(0,20)">筛选</el-button>
            </div>
        </List>
        <el-dialog title="编辑Banner" :visible.sync="addDialog" @cancel="addDialog = false">
            <el-form label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="addModel.name"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <ImageInput v-model="addModel.cover"></ImageInput>
                </el-form-item>
                <el-form-item label="跳转链接">
                    <el-input v-model="addModel.target"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="addModel.status">
                        <el-option :value="0" label="启用">启用</el-option>
                        <el-option :value="1" label="停用">停用</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input type="number" value="0" v-model="addModel.sort"></el-input>
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
import qs from "qs";
import payInfoVue from './payInfo.vue';

export default {
  components: {
    List,
    ImageInput
  },
  props: ['type'],
  data() {
    return {
      addDialog: false,
      loading: false,
      listData: [],
      pageInfo: {},
      addModel: {
        name: null,
        cover: null,
        target: null,
        status: 0,
        sort: 0
      },
      typeMap: ["首页","国际业务", "枫语课堂", "全球外教", "招商推广","公司介绍","新闻"],
      statusMap: { 0: "启用", 1: "停用"},
      filter:  {
          name: null,
          status: null,
          type: null
      },
      cities:[]
    };
  },
  created(){
    this.getCities()
  },
  watch: {
      addDialog (val){
        console.log("fuck")
          if (!val) {
            console.log("fuck")
              let addModel = this.addModel
              delete addModel.id
              addModel.name = null
              addModel.cover = null
              addModel.target = null
              addModel.status = 0
              addModel.sort = 0
          }
      }
  },
  methods: {
    getCities(){
      let vm = this
      getArea().then(it =>{
          vm.cities = it
      })
    },
    addBanner() {
      let vm = this;
      vm.loading = true;
      let payload = this.addModel;
      delete  payload.createTime
      delete  payload.updateTime
      payload.type = this.type
      this.ax.post("banner", qs.stringify(payload)).then(it => {
          it.statusName = vm.statusMap[it.status];
          it.typeName = vm.typeMap[it.type-1];
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
    getBanner(page, size) {
      let vm = this;
      this.ax
        .get("banner", {
          params: {
            page: page,
            size: size,
            name:this.filter.name,
            status: this.filter.status,
            type: this.type
          }
        })
        .then(it => {
          let status = {
            0: "启用",
            1: "停用"
          };
          vm.listData = it.content.map(it => {
            it.statusName = status[it.status];
            it.typeName = vm.typeMap[it.type-1];
            return it;
          });
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
        this.ax.delete("banner/"+id).then(it => {
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
          key: "name",
          name: "标题"
        },
        {
          key: "typeName",
          name: "位置"
        },
        {
          key: "statusName",
          name: "状态"
        },
        {
          key: "sort",
          name: "排序"
        },
        {
          key: 'target',
          name: '目标链接'
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


