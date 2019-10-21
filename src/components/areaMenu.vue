<template>
    <el-submenu :index="index+''"  v-bind:style="{background: menu.id === selected? '#e0f0f0':''}">
        <template slot="title">
            <span>{{menu.title || menu.name}}  </span>
            <span v-if="menu && menu.sub && menu.sub.length > 0">展开</span>
        </template>
        <!-- <el-menu-item :index="(index -1)+''">添加下级</el-menu-item> -->
        <div v-for="(item,indx) in menu.sub" :key="item.name">
             <area-menu :menu="item" v-if="item.sub && item.sub.length > 0" :index="index+'_'+indx" :selected="selected"></area-menu>    
             <el-menu-item :index="index+'_'+indx" v-else v-bind:style="{background: item.id === selected? '#e0f0f0':''}">{{item.title || item.name}}</el-menu-item>
        </div>
    </el-submenu>
</template>
<script>
export default {
    name: 'areaMenu',
    props: ['menu','index','selected'],
    methods: {
        getAddTitle(depth){
            switch(depth){
                case 0:
                   return "国家"
                case 1: 
                  return "省"
                case 2: 
                   return "市" 
                case 3:
                   return "县"
                case 4:
                    return "学校"
            }
        }
    }
}
</script>

