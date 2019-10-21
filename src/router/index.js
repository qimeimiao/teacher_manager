import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import AppMain from '../views/layout/components/AppMain'
import Empty from '../views/layout/components/empty'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/firstRun', component: () => import('@/views/login/firstRun'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      meta: { title: '面板' },
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/info',
    name: 'settings',
    hidden: true,
    meta: { title: '设置', icon: 'system' },

    children: [
      // {
      //   path: 'settings',
      //   name: 'settings',
      //   meta: { title: '系统设置', auth: true, super: true },
      //   component: () => import('@/views/settings/settings')
      // },


      // {
      //   path: 'manager',
      //   name: 'mananger',
      //   meta: { title: '设置管理员', auth: true, super: true },
      //   component: () => import('@/views/settings/managerList')
      // },

      {
        path: 'deptManager',
        name: 'deptManager',
        // hidden: true,
        meta: { title: '部门管理', auth: true, super: true },
        component: () => import('@/views/settings/deptManager')
      },
      {
        path: 'menuManager',
        name: 'menuManager',
        // hidden: true,
        meta: { title: '菜单管理', auth: true, super: true },
        component: () => import('@/views/settings/menuManager')
      },
      {
        path: 'roleManager',
        name: 'roleManager',
        // hidden: true,
        meta: { title: '角色管理', auth: true, super: true },
        component: () => import('@/views/settings/roleManager')
      },
      {
        path: 'userManager',
        name: 'userManager',
        // hidden: true,
        meta: { title: '用户管理', auth: true, super: true },
        component: () => import('@/views/settings/userManager')
      },
     

    ]
  },

  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/info',
    name: 'teacherinfo',
    meta: { title: '个人信息', icon: 'user' },
    hidden: true,
    children: [
      {
        path: 'teacherinfo',
        name: 'teacherinfo',
        meta: { title: '查看个人信息', auth: true },
        component: () => import('@/views/teacherinfo/teacherInfo')
      },
      {
        path: 'settings',
        name: 'settings',
        meta: { title: '修改密码', auth: true },
        component: () => import('@/views/settings/settings')
      }


    ]
  },
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/info',
  //   name: 'settings',
  //   meta: { title: '教师评教', icon: 'record' },
  //   children: [
  //     {
  //       path: 'settings',
  //       name: 'settings',
  //       meta: { title: '查看评教结果', auth: true, super: true },
  //       component: () => import('@/views/settings/settings')
  //     },
  //     {
  //       path: 'settings',
  //       name: 'settings',
  //       meta: { title: '进入评教', auth: true, super: true },
  //       component: () => import('@/views/settings/settings')
  //     },

  //   ]
  // },
  {
    path: '/evaluation',
    component: Layout,
    redirect: '/evaluation/info',
    name: 'viewevaluation',
    meta: { title: '评教管理', icon: 'record' },
    hidden: true,
    children: [
      {
        path: 'viewevaluation',
        name: 'viewevaluation',
        meta: { title: '查看评教内容', auth: true, super: true },
        component: () => import('@/views/evaluation/viewevaluation')
      },
      {
        path: 'setevaluation',
        name: 'setevaluation',
        meta: { title: '设置评教内容', auth: true, super: true },
        component: () => import('@/views/evaluation/setevaluation')
      },
       {
        path: 'beginEvaluation',
        name: 'beginEvaluation',
        hidden: true,
        meta: { title: '进入评教', auth: true, super: true },
        component: () => import('@/views/evaluation/beginEvaluation')
      },

    ]
  },
  {
    path: '/teachermanager',
    component: Layout,
    redirect: '/teachermanager/info',
    name: 'addteacher',
    meta: { title: '教师管理', icon: 'user' },
    hidden: true,
    children: [
      {
        path: 'addteacher',
        name: 'addteacher',
        meta: { title: '添加教师', auth: true, super: true },
        component: () => import('@/views/evaluation/viewevaluation')
      },
      {
        path: 'viewteacher',
        name: 'viewteacher',
        meta: { title: '查看教师', auth: true, super: true },
        component: () => import('@/views/teachermanager/viewTeacher')
      },

    ]
  },
  {
    path: '/studentmanager',
    component: Layout,
    redirect: '/studentmanager/info',
    name: 'addStudent',
    meta: { title: '学生管理', icon: 'user' },
    hidden: true,
    children: [
      {
        path: 'addStudent',
        name: 'addStudent',
        meta: { title: '添加学生', auth: true, super: true },
        component: () => import('@/views/evaluation/viewevaluation')
      },
      {
        path: 'setevaluation',
        name: 'setevaluation',
        meta: { title: '查看学生', auth: true, super: true },
        component: () => import('@/views/studentmanager/viewStudent')
      },

    ]
  },
  {
    path: '/coursemanager',
    component: Layout,
    redirect: '/coursemanager/info',
    name: 'CourseManager',
    meta: { title: '科目管理', icon: 'operator' },
    hidden: true,
    children: [
      {
        path: 'CourseManager',
        name: 'CourseManager',
        meta: { title: '科目管理', auth: true, super: true },
        component: () => import('@/views/coursemanager/CourseManager')
      },
      // {
      //   path: 'setevaluation',
      //   name: 'setevaluation',
      //   meta: { title: '查看学生', auth: true, super: true },
      //   component: () => import('@/views/studentmanager/viewStudent')
      // },

    ]
  },

  {
    path: '/student',
    component: Layout,
    redirect: '/student/info',
    name: 'myInfo',
    meta: { title: '学生信息', icon: 'user' },
    hidden: true,
    children: [
      {
        path: 'myInfo',
        name: 'myInfo',
        meta: { title: '学生个人信息', auth: true, super: true },
        component: () => import('@/views/student/studentInfo')
      },
      {
        path: 'security',
        name: 'security',
        meta: { title: '安全设置', auth: true, super: true },
        component: () => import('@/views/student/securitySetting')
      },
      {
        path: 'addcourse',
        name: 'addcourse',
        meta: { title: '添加课程', auth: true, super: true },
        component: () => import('@/views/student/addCourse')
      },
      {
        path: 'myCourse',
        name: 'myCourse',
        meta: { title: '学生课程', auth: true, super: true },
        component: () => import('@/views/student/studentCourse')
      },

    ]
  },
  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/info',
    name: 'teacherMyInfo',
    meta: { title: '教师信息', icon: 'user' },
    hidden: true,
    children: [
      {
        path: 'teacherMyInfo',
        name: 'teacherMyInfo',
        meta: { title: '教师个人信息', auth: true, super: true },
        component: () => import('@/views/teacherinfo/teacherInfo')
      },
      {
        path: 'teacherSecurity',
        name: 'teacherSecurity',
        meta: { title: '安全设置', auth: true, super: true },
        component: () => import('@/views/student/securitySetting')
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    // redirect: '/studentevaluation/info',
    name: 'studentEvaluation',
    hidden: true,
    meta: { title: '学生评教', icon: 'operator' },
    children: [
      {
        path: 'studentEvaluation',
        name: 'studentEvaluation',
        meta: { title: '学生评教', auth: true, super: true },
        component: () => import('@/views/student/studentEvaluation')
      },
     
    // { path: '/studentevaluation/evaluation', name: 'eva', component: Layout, component: () => import('@/views/evaluation/beginEvaluation'), hidden: true },
    ]
  },
  {
    path: '/teachervaluation',
    component: Layout,
    redirect: '/teachervaluation/info',
    name: 'teachErvaluation',
    hidden: true,
    meta: { title: '教师评教', icon: 'operator' },
    children: [
      {
        path: 'teachErvaluation',
        name: 'teachErvaluation',
        meta: { title: '给同行评教', auth: true, super: true },
        component: () => import('@/views/teacherinfo/teachErvaluation')
      },
      {
        path: 'teachErvaluationScore',
        name: 'teachErvaluationScore',
        meta: { title: '查看评教成绩', auth: true, super: true },
        component: () => import('@/views/teacherinfo/teachErvaluationScore')
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]


export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
