// 配置路由的地方
import Vue from "vue";
import VueRouter from "vue-router";
import routes from './routes'
//引入store
import store from '@/store'

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
let router = new VueRouter({
  // 配置路由
  routes: routes,
  // 路由跳转之后滚动条到最顶部
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { y: 0 }
  },
})

// 全局守卫：前置守，在路由跳转之间进行判断
router.beforeEach(async (to, from, next) => {
  //to:可以获取到你要跳转到那个路由信息
  //from:可以获取到你从哪个路由而来的信息
  //next:放行函数  next(path)放行指定路由，next(false),中断当前导航
  console.log('去往的路由', to, '从哪里来', from, '放行之后干什么函数', next, 'store', store)
  let token = store.state.user.token;

  //用户信息
  let name = store.state.user.userInfo.name;

  //用户已经登陆了才有token
  if (token) {
    //用户已经登陆了还想去login[不能去，停留在首页]
    if (to.path == '/login') {
      next('/home')
    } else {
      //登陆,去的不是login,而是[home|search|detail|shopcart]
      // 如果用户名已有
      if (name) {
        next();
      } else {
        // 没有用户信息，派发action让仓库存储用户信息再跳转
        try {
          // 获取用户信息成功
          await store.dispatch('user/getUserInfo');
          // 放行
          next();
        } catch (error) {
          // token失效了，从新登陆
          // 先清除删除用户存储信息，然后重定向到登录页面。
          store.dispatch('user/userLogout');
          next('/login');
        }
      }

    }
  } else {
    //未登录:不能去交易相关trade、不能去支付相关[pay/paysuccess]、不能去个人中心center
    //未登录去上面这些路由-----登录
    let toPath = to.path;
    if (toPath.indexof('/trade') != -1 || topath.indexof('/pay') != -1 || topath.indexof('/center') != -1) {
      //把未登录的时候向去而没有去成的信息，存储起来到地址栏中
      next('/login?redirect=' + toPath);
    } else {
      //去的不是上面这些路由（homelsearchlshopCart) ---放行
      next()
    }

  }


});


export default router;