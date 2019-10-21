<template>
    <div>
            
            <text-editor v-model="content" style="margin-left:80px"></text-editor>
            <div class="action-wrapper">
                <el-button type="primary" :loading="loading" @click="updatePolicy">保存</el-button>
            </div>
    </div>
</template>
<script>
import qs from 'qs'
import TextEditor from "@/components/TextEditor"
import {Message} from 'element-ui'
export default {
    components: {
        Message,
        TextEditor
    },
    data () {
        return {
            content: null,
            policyName: null,
            loading:false,
            editorConfig: {
                language_url: '/js/tinymce/zh_CN.js',
                height: '400px'
            }
        }
    },
    created(){
        this.policyName = this.$route.query.name
        this.title = this.$route.query.title
        this.getPolicy()
    },
    watch:{
        $route(){
            this.policyName = this.$route.name
            this.getPolicy()
        }
    },
    methods: {
        getPolicy(){
          let vm = this
          this.ax.get("webpage/querybyname?name="+this.policyName).then(data =>{
              vm.content = data && data.content || ""
          })
        },
        updatePolicy(){
            let vm = this
            vm.loading = true
            this.ax.post("webpage/update",{title: this.title,name:this.policyName,content:this.content}).then(()=>{
                vm.loading = false
                  Message({
                    message: '保存成功',
                    type: 'success',
                    duration: 2 * 1000
                })
            })  
        }
    }
}
</script>
<style scoped>
    .action-wrapper{
        padding: 20px;
        text-align: right;
    }
</style>


