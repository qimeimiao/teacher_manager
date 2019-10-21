<template>
  <div>
    <editor :init="editorConfig"  v-model="content"></editor>
    <input type="file" accept="image/*" hidden ref="imageInput" @change="onImageChose" />
    <el-dialog :visible.sync="uploading">
      <div>上传中....{{uploadProgress}}%</div>
    </el-dialog>
  </div>

  
</template>
<script>
import tinymce from "tinymce/tinymce";
import theme from "tinymce/themes/modern/index";
import Editor from "@tinymce/tinymce-vue";
import paste from "tinymce/plugins/paste";
import link from "tinymce/plugins/link";
import image from "tinymce/plugins/image";

import cn from '@/utils/tinymce/zh_CN.js';

import "tinymce/skins/lightgray/content.min.css";
import "tinymce/skins/lightgray/skin.min.css";
export default {
  name: "TextEditor",
  props: ["value"],
  components: {
    Editor
  },
  watch: {
    content(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.content = val;
    }
  },
  created() {
    this.content = this.value;
  },
  data() {
    let vm = this;
    return {
      content: null,
      uploading: false,
      uploadProgress: 0,
      imageField: null,
      editorConfig: {
        language_url: cn,
        height: "500px",
        width: "700px",
        plugins: ["paste", "link", "image"],
        file_picker_type: "image",
        file_browser_callback: function(field_name, url, type, win) {
          if (type == "image") {
            vm.choseImage(field_name);
          }
        }
      }
    };
  },
  methods: {
    choseImage(imageField) {
      this.imageField = imageField;
      this.$refs.imageInput.click();
    },
    onImageChose(val) {
      let file = val.target.files[0];
      if (!file) {
        return;
      }
      let vm = this;
      let form = new FormData();
      form.append("image", file);
      const config = {
        onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          vm.uploadProgress = percentCompleted;
        }
      };
      vm.uploading = true;
      this.ax.post("publicPicture/addPictureUrl", form, config).then(it => {
        vm.uploading = false;
        vm.uploadProgress = 0;
        let image = it;
        document.getElementById(vm.imageField).value = image;
        vm.$refs.imageInput.value = "";
        Message({
          message: "上传成功",
          type: "success",
          duration: 1 * 1000
        });
      });
    }
  }
};
</script>
<style scoped>
</style>
