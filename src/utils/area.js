import request from '@/utils/request'

export function  getArea(){
    return request.get('area',{params: {parentId: 0 }})
}