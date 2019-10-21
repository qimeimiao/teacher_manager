<template>
    <div>
      <div style="text-align:right">
        <el-button @click="$router.go(-1)" type="primary">返回</el-button>
      </div>
        <div v-for="item in paths" :key="item.name" style="border-bottom:solid 1px #f0f0f0;margin-bottom:20px">
          <div class="permission-title">
            <span class="permission-item" @click="checkAllItem(item)"><el-checkbox v-model="item.check" :indeterminate="isIndeterminate(item)" @change="onChange(item)"></el-checkbox>{{item.title}}</span>
          </div>
          <div>
            <span v-for="it in item.children" :key="it.name" class="permission-item" @click="it.check =!it.check"><el-checkbox v-model="it.check"></el-checkbox>{{it.title}}</span>
          </div>
        </div>
        <div>
          <el-button @click="savePermission" type="primary" :loading="loading">保存</el-button>
        </div>
      </div> 
</template>
<script>
import List from "@/components/List";
import {Message} from 'element-ui'
import qs from 'qs'
export default {
  components: {
    List
  },
  data() {
    return {
      userId: null,
      paths: [],
      permisions:[],
      loading: false
    };
  },
  created() {
    this.userId = this.$route.query.userId
    // if(!this.userId){
    //   this.$router.go(-1)
    //   return
    // }
    // let routers = this.$router.options.routes;
    // this.getPath(routers);
    this.getPermissions()
  },
  computed: {

  },
  methods: {
    onChange(item){
      
        item.children.forEach(it =>{
          it.check = item.check
        })
      
    },
    savePermission(){
      let permissions = []
      this.paths.forEach(it => {
        it.children.forEach(ch => {
            if(ch.check){
              permissions.push(ch)
            }
        })
      })
      let vm =  this
      this.loading = true
      this.ax.post("manager/"+this.userId+"/permission",qs.stringify({permissions: JSON.stringify(permissions)})).then(it => {
        vm.loading = false
        Message({
          message: '保存成功',
          type: 'success'
        })
      })
    },
    isIndeterminate(item){
      let isInterminate = true
      
      let selected = item.children.filter(it => {
          return  it.check
      })
      return selected.length !== item.children.length && (item.children.length - selected.length)!==item.children.length;
    },
    checkAllItem(item){
        item.check = !item.check
        item.children.forEach(it => {
          it.check = item.check
        })
    },
    getPermissions () {
      let vm =  this
      this.ax.get("user/urls").then(it => {
        if(!it){
          return
        }
        console.log(it);
        
      //  let permission = JSON.parse(it.permissions)
        // vm.paths.forEach(item => {
        //   if(item.children){
        //     item.children.forEach(li => {
        //       if(vm.hasPermission(permission,li)){
        //         li.check = true
        //       }
        //     })
        //   }
        //   item.check = item.children.filter(it =>{
        //     return it.check
        //   }).length === item.children.length
        // })
      })
    },
    hasPermission(list,item){
      return  list.filter(it => {
        return it.name === item.name
      }).length > 0
    },
    getPath(routers) {
      let vm = this;
      routers.forEach(it => {
        if(!it.hidden){
            let item = {path: it.path,title:it.meta.title,name: it.name}
            if (it.children) {
              item.children = []
              it.children.forEach(li => {
                item.children.push({path: li.path,title:li.meta.title,name: li.name,check: false})
              })
            }
            vm.paths.push(item)
        }
      });
    }
  },
  computed: {
    tableHeader() {
      return [
        {
          key: "title",
          name: "操作标题"
        },
        {
          key: 'name',
          name: "名字"
        }
      ];
    }
  }
};
</script>
<style scoped>
.permission-title{
  font-weight: bolder;
  padding: 10px 0;
}
.permission-item{
  display: inline-block;
  margin-right: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
}
.permission-item .el-checkbox{
  margin-right: 10px;
}
</style>


