import Vue from 'vue'
import App from './App.vue'
//三级联动组件---全局组件
import TypeNav from '@/pages/Home/TypeNav'
//第一个参数:全局组件的名字 第二个参数: 哪一个组件
Vue.component(TypeNav.name, TypeNav)


//注册路由功能
import router from './router';
new Vue({
  render: h => h(App),
  // 下面代码作用:给项目添加路由功能,给全部VC实例身上拥有两个属性,$router|$route
  // $route:一般获取路由信息[路径、query、params等等]
  // $router:一般进行编程式导航进行路由跳转[push|replace]
  router,
}).$mount('#app')
