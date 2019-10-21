<template>
    <el-popover
                        placement="top"
                        width="160"
                        v-model="showDelete">
                        <p>确认删除?</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="deleteItem">确认</el-button>
                            <el-button type="primary" size="mini" @click="showDelete = false">取消</el-button>
                        </div>
                        <el-button  type="danger" :size="size || 'mini'" @click="showDelete = true" slot="reference" :loading="loading">删除</el-button>
                    </el-popover>
</template>
<script>
import  Vue from 'vue'
export default {
    name: 'DeleteButton',
    props:['data', 'index','size','load'],
    data () {
        return  {
            loading: false,
            showDelete: false
        }
    },
    created(){

        if(this.data){
            this.loading = this.data.loading || false
        }
    },
    watch:{
        load(val){
            this.loading = val
        }
    },
    deactivated(){
        this.loading = false
        this.showDelete = false
    },
    destroyed(){
        this.loading = false
        this.showDelete = false
    },
    methods: {
        deleteItem () {
            if(this.data){
                Vue.set(this.data,'loading',true)
            }
            this.showDelete = false
            this.loading = true
            this.$emit("delete",this.data,this.index)
            if(this.data){
                this.loading = this.data.loading
            }
            
        }   
    }
}
</script>


