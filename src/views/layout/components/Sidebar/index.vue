<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="false"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import SidebarItem from './SidebarItem'
import { mapGetters } from 'vuex'
import store from '@/store'
export default {
  components: { SidebarItem},
  data(){
    return {
      routers: null
    }
  },
  methods: {
    hasItem(list,item){
      return list.filter(it => {
        return it.name == item.name
      }).length > 0
    }
  },
  computed: {
    ...mapGetters([
      'permission',
      'role'
    ]),
    routes() {
      let permission = this.permission
      let routers = JSON.parse(JSON.stringify(this.$router.options.routes))
     
       for (let i= 0; i < routers.length; i++){
        if(routers[i].meta){
          store.getters.role.forEach(res =>{
                if(routers[i].meta.title === res){
                  routers[i].hidden = false
                }
              });
          routers[i].children.forEach(li =>{
              store.getters.role.forEach(res =>{
                if(li.meta.title === res){
                  li.hidden = false
                }
              })
            })
        }
      }
     
    //  return routers
    //   if(this.role === 'SUPER_MANAGER'){
    //     return routers;
    //   }
    //   let vm = this
    //   routers.forEach(it => {
    //       if(!it.hidden && it.children){
    //         let hiddenCount = 0
    //           it.children.forEach(li =>{
    //               if(!vm.hasItem(permission,li)){
    //                   li.hidden = true
    //                   hiddenCount += 1
    //               } else {
    //                 li.hidden = li.hidden?li.hidden : false
    //               }
    //           })
    //           if(hiddenCount == it.children.length){
    //             it.hidden = true
    //           }
    //       }
    //   });
      return routers
    }
  }
}
</script>
