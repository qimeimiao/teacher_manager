<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-form
          label-position="top"
          label-width="80px"
          :model="formModel"
          :rules="rules"
          ref="formModel"
          :disabled="!editable"
        >
          <el-form-item
            v-for="item in config"
            :key="item.name"
            :label="item.title+' ('+item.description+')'"
            :prop="item.name"
          >
            <el-input v-model="formModel[item.name]" :placeholder="item.title"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit('formModel')" v-if="editable" :loading="loading">保存</el-button>
            <el-button  @click="cancelEdit" v-if="editable" :disabled="loading">取消</el-button>

          </el-form-item>
        </el-form>
        <el-button  @click="editable=true" v-if="!editable" type="primary">编辑</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: "settingPage",
  props: ["url"],
  data() {
    return {
      editable:false,
      config: [],
      rules: {},
      loading:false,
      formModel: {}
    };
  },
  created() {
    if (this.$props.url) {
      this.getConfig();
    }
  },
  watch: {
    config: {
      deep: true,
      handler(val) {
        this.updateModelValue();
      }
    }
  },
  methods: {
      cancelEdit(){
          this.updateModelValue()
          this.editable = false
      },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.doSubmit();
        } else {
          return false;
        }
      });
    },
    doSubmit() {
        let vm = this
        vm.loading = true
        this.ax.post("config/"+this.$props.url,this.formModel).then(it =>{
          console.log(this.formModel)
          vm.config = it;
          vm.updateRules();
          vm.updateModelValue();
          vm.loading = false
          vm.editable = false
          vm.$message.success({message:"修改成功"})
        })
    },
    getConfig() {
      let vm = this;
      this.ax
        .get("config/" + this.$props.url)
        .then(it => {
          vm.config = it;
          vm.updateRules();
          vm.updateModelValue();
        })
        .catch(it => {
          console.error(it);
        });
    },
    updateModelValue() {
      this.config.forEach(it => {
          Vue.set(this.formModel,it.name,it.value)
        // this.formModel[it.name] = it.value;
      });
    },
    updateRules() {
      this.config.forEach(it => {
        let rules = [];
        if (it.required) {
          rules.push({
            required: true,
            message: it.title + "不能为空",
            trigger: "blur"
          });
        }
        this.rules[it.name] = rules;
      });
    }
  }
};
</script>

