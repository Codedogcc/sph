// 配置路由的地方
import Vue from "vue";
import VueRouter from "vue-router";
// 使用插件
Vue.use(VueRouter);
// 引入路由组件
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
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
  routes: [
    {
      path: '/home',
      //命名路由,给路由起一个名字
      name: 'erha',
      component: Home,
      //路由元信息,新学习的一个配置项!!!!给当前路由添加一些额外数据
      //它的右侧是一个对象[可以有多个键值对]
      //路由配置项：书写的时候不要胡写、乱写、瞎写【在VC组件身上获取不到,没有任何意义】
      meta: { show: true },
    },
    {
      name: 'search',
      //在注册路由的时候,如果这里占位，切记务必要传递params，当params后面带有问号的时候，这时就可传可不传
      path: '/search/:keyword?',
      component: Search,
      meta: { show: true },
      //新增配置项:props,给路由组件传递props参数
      //第一种布尔模式,相当于把params参数，作为props属性值传递给这个路由组件
      // props:true,

      //第二种:对象形式
      // props:{a:1,b:'我爱你'}

      //第三种写法:函数写法.一般是把query参数与params参数当中props传递给路由组件!!!
      //route就是当前路由
      // props:(route)=>{
      //      //是将当前箭头函数返回结果，作为props传递给search路由组件!!!
      //      return {a:route.params.keyword,b:'可以传递参数'};
      // }
    }
    ,
    {
      path: '/login',
      component: Login,
      meta: { show: false },
    }
    ,
    {
      path: '/register',
      component: Register,
      meta: { show: false },
    }
    ,
    //重定向到首页
    {
      path: '/',
      redirect: '/home'
    }
    ,
  ]
})