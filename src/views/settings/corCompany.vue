<template>
    <div>
        <List :header="tableHeader" @page="getItems" :data="listData" :page="pageInfo" @delete="deleteItem" @edit="editItem">
            <div slot="top-actions">
                <el-button type="primary" @click="addItem">添加</el-button>
            </div>
            <div slot="filters">
                <el-input v-model="filter.name" placeholder="名称" style="width:auto" clearable></el-input>
                <el-button type="primary" @click="getItems(0,20)">筛选</el-button>
            </div>
            <el-table-column label="图片" slot="before">
                 <template slot-scope="scope">
                     <img v-bind:src="scope.row.cover" alt=""  style="max-width:10em">
                </template>
            </el-table-column>
        </List>
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
  props:['type'],
  data() {
    return {
        filter: {
            name: null
        },
      listData: [],
      pageInfo: {},
    };
  },
  watch: {
      type (val){
          this.filter.name = null
          this.getItems(0,20)
      }
  },
  created(){
      
  },
  methods: {
    getItems(page, size) {
      let vm = this;
      this.ax.get("media_text", {
          params: {
            page: page,
            size: size,
            type: this.type,
            name: this.filter.name
          }
        })
        .then(it => {
          vm.listData = it.content
          delete it.content;
          vm.pageInfo = it;
        });
    },
    editItem (item) {
        this.$router.push({name:'addMediaText',params:{type: this.type,id: item.id}})
    },
    deleteItem(id){
        let vm = this
        this.ax.delete("media_text/"+id).then(it => {
            vm.listData = vm.listData.filter(it =>{
                  return it.id !== id
              })
        })
    },
    addItem(){
        this.$router.push({name:'addMediaText',params:{type: this.type}})
    },
  },
  computed: {
    tableHeader() {
      return [
        {
          key: "title",
          name: "标题"
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


