<template>
    <div>
      <div class="title" v-if="title">{{title}}</div>
        <div class="top-bar">
            
            <div class="top-filters">
                <slot name="filters"></slot>
            </div>
            <div class="top-actions" v-if="!noTopAction">
                <slot name="top-actions"></slot>
            </div>
        </div>
        <div class="top-bar">
          <slot name="statistic"></slot>
        </div>
         <el-table :data="data" border @row-click="onRowClick" v-loading="loading">
        <el-table-column type="selection" width="55" v-if="showSelect"></el-table-column>
         <el-table-column type="index"></el-table-column>
            <slot name="before"></slot>
             <el-table-column  v-for="item in header" :prop="item.key" :label="item.name" :key="item.key" v-if="!item.hide"></el-table-column>
             <slot name="actions">
             <el-table-column label="操作" v-if="!disableAction">
               <template slot-scope="scope">
                    <el-button v-if="extraAction" size="mini" @click="$emit('extraAction',scope.row,scope.$index)">{{extraAction}}</el-button>
                    <el-button  size="mini" @click="editItem(scope.row,scope.$index)" v-if="!disableEdit">{{editTitle}}</el-button>
                    <el-popover
                        placement="top"
                        width="160"
                        v-model="scope.row.showDelete">
                        <p>确认删除?</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="scope.row.showDelete = false;deleteItem(scope.row,scope.$index)">确认</el-button>
                            <el-button type="primary" size="mini" @click="scope.row.showDelete = false">取消</el-button>
                        </div>
                        <el-button  type="danger" size="mini" @click="scope.row.showDelete = true" slot="reference" :loading="scope.row.loading">删除</el-button>
                    </el-popover>
                </template>
             </el-table-column>
             </slot>
        </el-table>
        <div class="page-wrapper">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.totalCount"
            v-if="page.pageSize"
            >
        </el-pagination>
        </div>

    </div>
</template>
<script>
import Vue from "vue";
export default {
  name: "List",
  props: {
    editTitle: {
      type: String,
      default: '编辑'
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    header: {
      type: Array,
      default: () => {
        return [];
      }
    },
    page: {
      type: Object,
      default: () => {
        return {};
      }
    },
    noTopAction:{
      type: Boolean,
      default: false
    },
    extraAction: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    disableEdit: {
      type: Boolean,
      default: false
    },
    disableAction: {
      type: Boolean,
      default: false
    },
    showSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageInfo: {},
      visible2: false
    };
  },
  watch: {
    
  },
  mounted() {
    this.handleCurrentChange(1, 10);
  },
  methods: {
    onRowClick(row, event, column){
        
    },
    editItem(row, index) {
      this.$emit("edit", row, index);
    },
    deleteItem(row, index) {
      Vue.set(row, "loading", true);
      this.$emit("delete", row.id, index);
    },
    handleSizeChange(size) {
      this.$emit("page", this.page.pageSize, size);
    },
    handleCurrentChange(page) {
      this.$emit("page", page, 10);
    },
    deleteFaild(index) {
      this.data[index].loading = false;
    }
  }
};
</script>
<style scoped>
.page-wrapper {
  margin: 10px 0;
  text-align: right;
}
.top-filters {

  flex: 1;
  padding: 10px 0;
}
.top-actions {
  text-align: right;
  flex: 1;
  padding: 10px 0;
}
.title {
  padding: 10px 0;
  line-height: 40px;
}
.top-bar {
  display: flex;
  margin-bottom: .4rem;
}
.el-button{
  margin-bottom: 10px;
}
</style>


