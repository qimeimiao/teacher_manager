import Vue from "vue";

/**
 * @Description: 隐藏手机号中间四位 例: 123****1234
 * @author Wish
 * @date 2019/8/26
*/
Vue.prototype.$GetTelPhoneData = (data) =>{
  let telPhone;
  if(!data){
    telPhone = '未知手机号'
  } else {
    if (typeof data == 'number') {
      data = data.toString();
    }
    telPhone = data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  return telPhone;
};

/**
 * @Description: 时间截取 例:2019-8-26
 * @author Wish
 * @date 2019/8/27
*/
Vue.prototype.$GetTimeData = (data) =>{
  return data.substring(0, 10);
};

/**
 * @Description: 文件名获取
 * @author Wish
 * @date 2019/8/27
 */
Vue.prototype.$GetFileName = (data) =>{
  if(data){
    let fileNameIndex = data.lastIndexOf("/") + 1;
    return data.substr(fileNameIndex)
  } else {
    return '暂无文件'
  }
};

