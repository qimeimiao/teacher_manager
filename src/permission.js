import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
const whiteList = ['/login','/firstRun'] // 不重定向白名单

let routers = []

router.options.routes.forEach(it => {
    if(!it.hidden){
      routers.push(it)
    }
    if(it.children){
      it.children.forEach(li => {
        if(!it.hidden){
          routers.push(li)
        }
      })
    }
})

function  inList(list,item){
  if(!list){
    list = []
  }
  return  list.filter(it => {
    return it.name == item.name
  }).length > 0
}
function navigation(to,next){
  let permission  = store.getters.permission
 //if(store.getters.role === 'SUPER_MANAGER'){    1
    if(store.getters.role.length > 0){
    next()
    return
  }
  // next()
  // console.log("role:"+store.getters.role)
  // if(inList(routers,to) && !inList(permission,to)){
  //   Message.error('没有该操作权限')
  //   NProgress.done()
  //   next({ path: '/' })
  // } else{
  
  // }
}
router.beforeEach((to, from, next) => {
  NProgress.start()
  // navigation(to,next)
  //   return
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      navigation(to,next)
      if(store.getters.role.length === 0 ) {
          store.dispatch('GetInfo').then(res => { // 拉取用户信息
            const roleList = [];
            res.menuDtos.map(res =>{
              roleList.push(res.menuName)
            })
            const roles = roleList;

            navigation(to,next) 
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else{
        navigation(to,next)
      }
  
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
