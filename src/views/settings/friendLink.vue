<template>
    <div>
        <List :header="tableHeader" :data="listData" @edit="editItem" @delete="deleteItem">
            <div slot="top-actions">
                <el-button type="primary" @click="showAddModal=true">新增</el-button>
            </div>
        </List>

        <el-dialog :visible.sync="showAddModal" title="编辑合作网站">
            <el-form>
                <el-form-item label="名称"> 
                    <el-input v-model="addModel.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="链接"> 
                    <el-input v-model="addModel.value" placeholder="链接"></el-input>
                </el-form-item>
                <el-form-item label="排序"> 
                    <el-input v-model="addModel.sort"></el-input>
                </el-form-item>
                
            </el-form>
            <div slot="footer">
                    <el-button  @click="showAddModal=false">取消</el-button>
                    <el-button type="primary" :loading="loading" @click="saveContent">确定</el-button>
                </div>
        </el-dialog>
    </div>
</template>
<script>
 import List from '@/components/List'
 import {Message} from 'element-ui'
 import qs from 'qs'
export default {
    components: {
        List,
        Message
    },
    data () {
        return {
            loading: false,
            showAddModal: false,
            listData: [],
            addModel: {
                name: null,
                value: null,
                sort: 0
            }
        }
    },
    created () {
        this.getContent()
    },
    watch: {
        showAddModal (val){
            if(!val){
                let model = this.addModel
                delete model.id
                model.name = null
                model.value = null
                model.sort = 0
            }
        }
    },
    methods: {
        saveContent(){
            let vm = this
            let data = this.addModel
            let msg = null
            if(!data.name){
                msg = '请填写名称'
            }
            if(!data.value){
                msg = '请填写链接'
            }
            if(msg){
                Message({
                    message: msg
                });

                return
            }
            let payload = this.listData.slice()
            if(data.id){
                console.log()
                payload = payload.map(it => {
                    if(it.id === data.id){
                        Object.assign(it,data)
                    }
                    return it
                })
            } else {
                data.id = new Date().getTime()
                payload.push(data)
            }
            payload.sort((a,b)=>{
                return a.sort - b.sort
            })
            vm.loading = true
            this.ax.post('friends_link',qs.stringify({content:JSON.stringify(payload)})).then(it => {
                vm.listData = JSON.parse(it)
                vm.loading = false
                vm.showAddModal = false
            })
        },
        deleteItem(id,index){
            let content = this.listData.slice()
            let vm =  this
            content.splice(index,1)
            this.ax.post('friends_link',qs.stringify({content:JSON.stringify(content)})).then(it => {
                vm.listData = JSON.parse(it)
            })
        },
        getContent () {
            let vm = this
            this.ax.get('friends_link').then(it => {
                if(it !== ''){
                    vm.listData = JSON.parse(it)
                } else {
                    vm.listData = []
                }
            })
        },
        editItem(item, index){
            Object.assign(this.addModel,item)
            this.showAddModal = true
        }
    },
    computed: {
        tableHeader () {
            return [
                {
                    key: 'name',
                    name: '名称'
                },
                {
                    key: 'value',
                    name: '链接'
                },
                {
                    key: 'sort',
                    name: '排序'
                }
            ]
        }
    }
}
</script>
<style scoped>

</style>

