<template>
    <div>
        <el-form :disabled="!editable">
            <el-form-item label="网站域名" :label-width="labelWidth">
                <el-input label="网站域名" v-model="editData.domain"></el-input>
            </el-form-item>
            <el-form-item label="客服电话" :label-width="labelWidth">
                <el-input label="客服电话" v-model="editData.hotLine"></el-input>
            </el-form-item>
            <el-form-item label="联系QQ" :label-width="labelWidth">
                <el-input label="联系QQ" v-model="editData.qq"></el-input>
            </el-form-item>
            <el-form-item label="联系微信" :label-width="labelWidth">
                <el-input label="联系微信" v-model="editData.wechat"></el-input>
            </el-form-item>
            <el-form-item label="公司网站" :label-width="labelWidth">
                <el-input label="公司网站" v-model="editData.website"></el-input>
            </el-form-item>
            <el-form-item label="关于" :label-width="labelWidth">
                <el-input label="公司地址" v-model="editData.about" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="Logo" :label-width="labelWidth">
                <image-input v-model="editData.logo"></image-input>
            </el-form-item>
            <!-- <el-form-item label="来华留学咨询电话" :label-width="labelWidth">
                <el-input v-model="editData.studyInChinaContact"></el-input>
            </el-form-item>
            <el-form-item label="来华留学邮箱" :label-width="labelWidth">
                <el-input v-model="editData.studyInChinaMail"></el-input>
            </el-form-item>
            <el-form-item label="来华留学联系人" :label-width="labelWidth">
                <el-input v-model="editData.studyInChinaPerson"></el-input>
            </el-form-item>
            <el-form-item label="来华留学联系人电话" :label-width="labelWidth">
                <el-input v-model="editData.studyInChinaPersonPhone"></el-input>
            </el-form-item>
            <el-form-item label="来华留学申请表" :label-width="labelWidth">
                <image-input v-model="editData.studyInChinaApplyForm" type="file" :disablePreview="true"></image-input>
            </el-form-item>
            <el-form-item label="来华留学签证申请表" :label-width="labelWidth">
                <image-input v-model="editData.studyInChinaVisaForm" type="file" :disablePreview="true"></image-input>
            </el-form-item> -->
        </el-form>
        <el-form>
        <el-form-item label="" :label-width="labelWidth">
                 <el-button type="primary" :disabled="!editable" :loading="loading" @click="saveConfig">保存</el-button>
                 <el-button type="primary" @click="editable=true" v-if="!editable">编辑</el-button>
                 <el-button v-if="editable" @click="cancelEdit">取消</el-button>
            </el-form-item>
        </el-form>
        
    </div>
</template>
<script>
import ImageInput from "@/components/ImageInput";
import qs from 'qs'
export default {
    components: {
        ImageInput
    },
    data () {
        return {
            loading: false,
            editable: true,
            labelWidth: '10em',
            originData: {},
            editData: {}
        }
    },
    watch: {
        editable (val){
            if(!val){
                
            }
        }
    },
    created () {
        this.getConfig()
    },
    methods: {
        cancelEdit (){
            Object.assign(this.editData,this.originData)
            this.editData = JSON.parse(JSON.stringify(this.originData))
            this.editable = false
        },
        getConfig () {
         let vm = this
           this.ax.get("config/application").then(it => {
               vm.originData = it
               vm.editData = JSON.parse(JSON.stringify(it))
            //    Object.assign(vm.editData,vm.originData)
               vm.editable = false
           })
        },
        saveConfig () {
            let vm = this
            vm.loading = true
            delete this.editData.friendsLinks
            this.ax.post("config/application", qs.stringify(this.editData)).then(it => {
                vm.loading = false
                vm.originData = it
                vm.editable = false
            }).catch(it => {
                vm.loading = false
            })
        },
    }
}
</script>
<style scoped>

</style>


