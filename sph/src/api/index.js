// 当前这个模块，API进行统一管理
import requests from "./request";
import mockRequests from "./mockRequest";
// 三级联动接口
// /api/product/getBaseCategoryList  是个 get 请求 且无参数
export const reqCategoryList = () => {
  //箭头函数可以在程序任意地方使用,箭头函数返回即为服务器的数据
  //下面箭头函数返回值：返回的是什么? promise,即为返回服务器的数据
  //return关键字，千万别忘记书写，如果忘记书写，你在任意地方获取的都是undeinfed
  return requests({ method: 'get', url: '/product/getBaseCategoryList' });
}
//获取banner (Home首页轮播图接口)
export const reqGetBannerList = () => {
  return mockRequests({ method: 'get', url: '/banner' });
}