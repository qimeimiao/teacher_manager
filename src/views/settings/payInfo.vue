<template>
  <div>
    <el-form :disabled="!editable">
      <el-form-item label="小程序AppId">
        <el-input placeholder="小程序AppId" v-model="editData.appId"></el-input>
      </el-form-item>
      <el-form-item label="小程序AppSecret">
        <el-input placeholder="小程序AppSecret" v-model="editData.appSecret"></el-input>
      </el-form-item>
      <el-form-item label="支付回调地址">
        <el-input placeholder="微信支付商户号" v-model="editData.wechatPayCallbackDomain"></el-input>
      </el-form-item>
      <el-form-item label="微信支付商户号">
        <el-input placeholder="微信支付商户号" v-model="editData.wechatPayMchId"></el-input>
      </el-form-item>
      <el-form-item label="微信支付密钥">
        <el-input placeholder="微信支付密钥" v-model="editData.wechatPayKeySecret"></el-input>
      </el-form-item>
      <el-form-item label="微信支付证书目录(绝对路径)">
        <el-input placeholder="微信支付证书目录" v-model="editData.wechatPayKeyPath"></el-input>
      </el-form-item>
      <el-form-item label="认证费用(元，如0.01)">
        <el-input placeholder="认证费用" v-model="editData.recordFee"></el-input>
      </el-form-item>
      <el-form-item label="认证有效期(小时,如：24)">
        <el-input placeholder="认证有效期" v-model="editData.recordExpire"></el-input>
      </el-form-item>
      <el-form-item label="房屋是否审核">
        <el-radio v-model="editData.houseNeedReview" label="true">是</el-radio>
        <el-radio v-model="editData.houseNeedReview" label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="认证配置"></el-form-item>
      <el-form-item label="服务器地址(示例值：http://125.88.149.134:8085)">
        <el-input placeholder="服务器地址" v-model="editData.verifyHost"></el-input>
      </el-form-item>
      <el-form-item label="key">
        <el-input placeholder="key" v-model="editData.verifyKey"></el-input>
      </el-form-item>
      <el-form-item label="Secret">
        <el-input placeholder="Secret" v-model="editData.verifySecret"></el-input>
      </el-form-item>
      <el-form-item label="备案配置"></el-form-item>
      <el-form-item label="服务器地址(示例值：http://59.55.125.11:8181)">
        <el-input placeholder="服务器地址" v-model="editData.reviewHost"></el-input>
      </el-form-item>
      <el-form-item label="key">
        <el-input placeholder="key" v-model="editData.reviewKey"></el-input>
      </el-form-item>
      <el-form-item label="活体检测"></el-form-item>
      <el-form-item label="secretId">
        <el-input placeholder="secretId" v-model="editData.liveDetectSecretId"></el-input>
      </el-form-item>
      <el-form-item label="secretKey">
        <el-input placeholder="SecretKey" v-model="editData.liveDetectSecretKey"></el-input>
      </el-form-item>
      <el-form-item label="最小相似度(1-100整数)">
        <el-input placeholder="最小相似度" v-model="editData.liveDetectMinimalSim"></el-input>
      </el-form-item>
    </el-form>
    

    <el-form>
      <el-form-item label>
        <el-button type="primary" :disabled="!editable" :loading="loading" @click="saveConfig">保存</el-button>
        <el-button type="primary" @click="editable=true" v-if="!editable">编辑</el-button>
        <el-button v-if="editable" @click="cancelEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ImageInput from "@/components/ImageInput";
import qs from "qs";
export default {
  components: {
    ImageInput
  },
  data() {
    return {
      loading: false,
      editable: true,
      labelWidth: "10em",
      originData: {},
      editData: {}
    };
  },
  watch: {
    editable(val) {
      if (!val) {
      }
    }
  },
  created() {
    this.getConfig();
  },
  methods: {
    cancelEdit() {
      Object.assign(this.editData, this.originData);
      this.editData = JSON.parse(JSON.stringify(this.originData));
      this.editable = false;
    },
    getConfig() {
      let vm = this;
      this.ax.get("config/wechat/ma").then(it => {
        console.log(this)
        console.log(arguments.callee)
        vm.originData = it;
        vm.editData = JSON.parse(JSON.stringify(it));
        //    Object.assign(vm.editData,vm.originData)
        vm.editable = false;
      });
    },
    saveConfig() {
      let vm = this;
      vm.loading = true;
      delete this.editData.friendsLinks;
      this.ax
        .post("config/wechat/ma", qs.stringify(this.editData))
        .then(it => {
          vm.loading = false;
          vm.originData = it;
          vm.editable = false;
        })
        .catch(it => {
          vm.loading = false;
        });
    }
  }
};
</script>
<style scoped>
</style>


