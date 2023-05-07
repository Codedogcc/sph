// 配置路由的地方
import Vue from "vue";
import VueRouter from "vue-router";
import routes from './routes'
// 使用插件
Vue.use(VueRouter);
//1.先把VueRouter原型对象的push，先保存一份
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
console.log(originPush);
//2. 重写push/replace
// 三个参数：
// 1.告诉原来的push方法，往哪里跳转（传递哪些参数） 
// 2.成功回调 
// 3.失败回调
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    // call和apply区别
    // 相同：都可以调用函数一次，篡改函数上下文一次（this指向）
    // 不同点：call传递参数用逗号隔开，apply方法执行，传递数组
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(this, location, () => { }, () => { })
  }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => { }, () => { })
  }
}
// 配置路由
export default new VueRouter({

  // 配置路由
  routes: routes,
  // 路由跳转之后滚动条到最顶部
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { y: 0 }
  },

})