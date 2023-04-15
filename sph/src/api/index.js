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

// 获取floor数据
export const reqFloorList = () => {
  return mockRequests({ method: 'get', url: '/floor' });
}

//获取搜索模块数据 地址:/api/list 请求方式：post
/* 入参例子
  {
  "category3Id": "61",
  "categoryName": "手机",
  "keyword": "小米",
  "order": "1:desc",
  "pageNo": 1,
  "pageSize": 10,
  "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
  "trademark": "4:小米"
}
*/
//当前这个函数需不需要接受外部传递参数
//当前这个接口(获取搜索模块的数据) ，给服务器传递一个默认参数[至少是一个空对象]
export const reqGetSearchInfo = (params) => {
  return requests({ method: 'post', url: '/list', data: params });
}
// /api/list