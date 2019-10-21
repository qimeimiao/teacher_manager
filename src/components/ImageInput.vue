<template>
  <div>
    <div class="input-wrapper" v-if="type === 'image'">
      <el-input type="text" placeholder="图片链接(回车确定)" v-model="image" @keyup.enter.native="addImage"></el-input>
      <span class="tips">或者</span>
      <el-button type="primary" @click="uploadFile">本地上传</el-button>
      <input type="file" @change="onSelectedFile" ref="upload" accept="image/*" hidden>
    </div>
    <div class="input-wrapper" v-if="type ==='video'">
      <el-input type="text" placeholder="视频链接" v-model="image"></el-input>
      <span class="tips">或者</span>
      <el-button type="primary" @click="uploadFile">本地上传</el-button>
      <input type="file" @change="onSelectedFile" ref="upload" accept="video/mp4" hidden>
    </div>
    <div class="input-wrapper" v-if="type ==='file'">
      <el-input type="text" placeholder="文件链接" v-model="image"></el-input>
      <span class="tips">或者</span>
      <el-button type="primary" @click="uploadFile">本地上传</el-button>
      <input type="file" @change="onSelectedFile" ref="upload" hidden>
    </div>

    <div v-if="uploading && disablePreview">{{uploadProgress}}%</div>
    <div
      class="mask-wrapper"
      v-if="(imagePreview || image) && !disablePreview && type !== 'image'"
      v-for="(item,index)  in  images"
      :key="index"
    >
      <img v-bind:src="item.url || item.preview" alt class="preview" v-if="type !== 'video'">
      <div v-else>
        <video v-bind:src="imagePreview || item.url"
          controls
          class="preview"
          v-if="imagePreview || image"
        ></video>
      </div>
      <div class="mask" v-if="uploading">
        <div class="upload-progress">{{item.progress}}%</div>
      </div>
    </div>
    <div class="mask-wrapper" v-if="type === 'image'" v-for="(item,index)  in  images" :key="index">
      <img v-bind:src="item.url||item.preview" class="preview">
      <div class="mask" v-if="item.uploading">
        <div class="upload-progress">{{item.progress}}%</div>
      </div>
      <div class="delete" @click="deleteItem(index)">
        <svg-icon icon-class="delete"/>
      </div>
    </div>
  </div>
</template>
<script>
import {Message} from 'element-ui'
export default {
    name: 'ImageInput',
    props: {
        'value':{
            type: String
        },
        'type': {
            type: String,
            default:'image'
        },
        'disablePreview':{
            type: Boolean,
            default: false
        },
        'maxCount': {
            type: Number,
            default: 1
        },
        "url":{
            type:String,
            default :"image"
        }
    },
    components: {
        Message
    },
    watch: {
        images(images){
            this.updateResult()
        },
        value (val) {
            this.image = val
        }
    },
    destroyed(){
        this.images = []
    },
    created(){
        if(this.value){
            this.images = this.value.split(",").map(it => {
                return {url: it}
            })
        }
    },
    data () {
        return {
            image: null,
            imagePreview: null,
            uploadProgress: 0,
            uploading: false,
            images: []
        }
    },
    methods: {
        updateResult(){
            let images = this.images
            if(this.maxCount === 1){
                let url = images[0]  && images[0].url
                this.$emit("input",url)      
            } else {
                this.$emit("input",images.map(it => {return it.url}).join(','))
            }
        },
        addImage(){
            if(this.maxCount === 0 || this.images.length < this.maxCount){
                this.images.push({url: this.image})
                this.image = null
            }
        },
        deleteItem(index){
            this.images.splice(index,1)
        },
        uploadFile (){
            this.$refs.upload.click()
        },
        onSelectedFile (val){
            let vm = this
            if(this.maxCount !== 0 && this.images.length >= this.maxCount){
                vm.$refs.upload.value = ""
                return
            }
            let file = val.target.files[0]
            if(!file){
                vm.$refs.upload.value = ""
                return
            }
            let image = {
                preview: null,
            }
            if(!this.disablePreview){
                this.previewImage(file,(data)=>{
                    image.preview = data
                })
            }
            let form = new FormData()
            
            form.append("image",file)
            form.append("image",file)
            const config = {
                onUploadProgress: function(progressEvent) {
                    var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
                    vm.uploadProgress = percentCompleted
                    image.progress = percentCompleted
                }
            }
            image.uploading = true
            // let path = this.type
            this.images.push(image)
            this.ax.post(this.url,form,config).then(it =>{
                image.url = it
                image.uploading = false
                vm.updateResult()
                vm.$refs.upload.value = ""
                  Message({
                    message: '上传成功',
                    type: 'success',
                    duration: 1* 1000
                })
            })
        },
        previewImage (file,cb){
            var reader = new FileReader();
            let vm = this
            reader.onload = function(e) {
                vm.imagePreview  = e.target.result
                cb && cb(e.target.result)
            }
            reader.readAsDataURL(file);
        }
    }
}
</script>
<style lang="css" scoped>
  .mask-wrapper{
      position: relative;
      margin-top: 10px;
      max-width: 6em;
      max-height: 6em;
      margin-right: 1em;
      display: inline-block;
  }
  .delete{
    top: -0.5em;
    right: -0.5em;
    cursor: pointer;
    height: 1em;
    display: inline-block;
    width: 1em;
    position: absolute;
  }
  .mask-wrapper img{
      width: 100%;
  }
  .mask{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3)
  }
  .upload-progress{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      color: white;
  }
  .input-wrapper{
      display:flex;
  }
  .el-input{
      max-width:20em;
  }
  
  .tips{
      padding: 0 10px;
  }
  .preview{
    max-width: 20em;
    margin-bottom: -13px;
  }
</style>


