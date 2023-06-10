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

//获取产品详情信息的接口 URL: /api/item/[ skuid } 请求方式: get
export const reqGoodsInfo = (skuid) => {
  return requests({ url: `/item/${skuid}`, method: 'get' })
}

//将产品添加到购物车中(获取更新某一个产品的个数 )
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({
  url: `/cart/addToCart/${skuId}/${skuNum}`,
  method: "post"
})

//删除购物产品的接口
export const reqDeleteCartById = (skuId) => requests({
  url: `/cart/deleteCart/${skuId}`,
  method: "delete"
})

// 获取购物车列表数据接口
export const reqCartList = () => requests({
  url: `/cart/cartList`,
  method: "get"
})

// 修改商品的选中状态
export const reqUpdateCheckedByid = (skuId, isChecked) => requests({
  url: `/cart/checkCart/${skuId}/${isChecked}`,
  method: "get"
})


// 获取验证码
export const reqGetCode = (phone) => requests({
  url: `/user/passport/sendCode/${phone}`,
  method: "get"
})

// 注册用户
export const reqUserRegister = (data) => requests({
  url: `/user/passport/register`,
  method: "post",
  data
})

// 登录 
export const reqUserLogin = (data) => requests({
  url: `/user/passport/login`,
  method: "post",
  data
})

// 获取用户信息【需要带有token向服务器请求用户信息】
export const reqGetUserInfo = () => requests({
  url: `/user/passport/auth/getUserInfo`,
  method: "get"
})

// 退出登录
export const reqLogout = () => requests({
  url: `/user/passport/logout`,
  method: "get"
})