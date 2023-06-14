// 通过mockjs插件实现模拟数据

// 引入mockjs模块
import Mock from 'mockjs'
// 把JSON数据格式引入进来，这里的两个json并没有对外暴露，是因为
// webpack 默认对外暴露的有 ： 图片、Json数据
import banner from './banner.json'
import floor from './floor.json'
import address from './address.json'
import order from './order.json'
import paydetail from './paydetail.json'
import personorder from './personorder.json'
//mock数据:第一个参数请求地址第二个参数:请求数据
Mock.mock("/mock/banner", { code: 200, data: banner }); //模拟首页大的轮播图的数据
Mock.mock("/mock/floor", { code: 200, data: floor });
Mock.mock("/mock/address", { code: 200, data: address });
Mock.mock("/mock/order", { code: 200, data: order });
Mock.mock("/mock/paydetail", { code: 200, data: paydetail });
Mock.mock("/mock/personorder", { code: 200, data: personorder });