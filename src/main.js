import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import VueAMap from 'vue-amap'
import '@/icons' // icon
import '@/permission' // permission control
import request from '@/utils/request'
import VueCropper from "vue-cropper" 

import VCharts from 'v-charts'
import axios from 'axios'
Vue.prototype.$axios= axios

import '@/utils/tools'

Vue.use(ElementUI, { locale })
// Vue.use(VueAMap)
// Vue.use(VCharts)
Vue.use(VueCropper)

// VueAMap.initAMapApiLoader({
//   key: 'b246d0215b3ce31eb4b7c835a5b07f62',
//   plugin: ['AMap.Autocomplete', 'PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
//   // 默认高德 sdk 版本为 1.4.4
//   v: '1.4.4'
// });
Vue.config.productionTip = false
Vue.prototype.ax = request
Vue.prototype.success = msg =>{
  app.$message.success(msg)
}
Vue.prototype.error = msg =>{
  app.$message.error(msg)
}

function appendZero(b){
  if(b < 10){
    return '0'+b;
  }
  return b
}

Vue.prototype.formatData = time =>{
  let date = new Date(time)
  return [date.getFullYear(),appendZero(date.getMonth()+1),appendZero(date.getDate())].join("-") +' '+ [appendZero(date.getHours()),appendZero(date.getMinutes()),appendZero(date.getSeconds())].join(":")
}
Vue.prototype.OnError =(msg)=>{
  app.error(msg)
}
let loadings  = []
Vue.prototype.startLoading = (msg) =>{
  let load = app.$loading({
    lock: true,
    text: msg || 'Loading',
    background: 'rgba(0, 0, 0, 0.2)'
  })
  loadings.push(load)
}
Vue.prototype.stopLoading = ()=>{
  loadings.forEach(it =>{
    it.close()
  })
  loadings = []
}
Vue.prototype.confirm = (title) =>{
  return app.$confirm(title||'确认?',{
    closeOnClickModal:false
  }).catch(it =>{})
}

let app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
