import request from '@/utils/request'
import qs from 'qs'
export function login(userNmae, password) {
  return request({
    url: '/login',
    method: 'post',
    data: qs.stringify({
      userNmae,
      password
    })
  })
}

export function getInfo(token) {
  return request({
    url: '/user/userinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}
