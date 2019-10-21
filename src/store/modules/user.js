import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    role: '',
    permission: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLE: (state, roles) => {
      state.role = roles
    },
    SET_PERMISSION: (state, permission) => {
      if (permission) {
        state.permission = JSON.parse(permission)
      } else {
        state.permission = []
      }

    }
  },

  actions: {
    // onLogin({commit},userInfo){
    //   commit("SET_ROLE",userInfo.role)
    //   commit("SET_NAME",userInfo.mobile)
    //   console.log("set role"+userInfo.role)
    //   setToken(userInfo.token)
    // },
    onLogin({ commit }, userInfo) {
      let roleNameArr = [];

      // commit("SET_ROLE",'SUPER_MANAGER')
      commit("SET_ROLE",roleNameArr)
      commit("SET_NAME", userInfo.user.mobile)
      commit("SET_USERID", userInfo.user.userId)

      // console.log("set role"+userInfo.role)
      setToken(userInfo.token)
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response
          const roleList = [];
          response.menuDtos.map(res =>{
            roleList.push(res.menuName)
          })
          commit('SET_NAME', data.mobile)
          commit('SET_USERID', data.userId)
          // commit('SET_ROLE', data.role)
          commit("SET_ROLE",roleList)
          //commit('SET_ROLE', 'SUPER_MANAGER')
          commit('SET_PERMISSION', data.permission)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLE', '')
          // commit('SET_USERID', data.userId)
          // commit('SET_PERMISSION', data.permission)
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
