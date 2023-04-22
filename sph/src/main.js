import Vue from 'vue'
import App from './App.vue'

//引入三级联动组件---全局组件
import TypeNav from '@/components/TypeNav'
//第一个参数:全局组件的名字 第二个参数: 哪一个组件
Vue.component(TypeNav.name, TypeNav)

// 引入轮播图组件
import Carousel from '@/components/Carousel'
Vue.component(Carousel.name, Carousel)


//注册路由功能
import router from '@/router';

// 注册vuex的仓库
import store from "@/store";
//引入MockServer.js----mock数据
import '@/mock/mockServe';
//引入swiper样式
import "swiper/css/swiper.css"


new Vue({
  render: h => h(App),
  // 全局事件总线$bus配置
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  // 下面代码作用:给项目添加路由功能,给全部VC实例身上拥有两个属性,$router|$route
  // $route:一般获取路由信息[路径、query、params等等]
  // $router:一般进行编程式导航进行路由跳转[push|replace]
  router,
  //注册仓库:组件实例的身上会多个一个属性$store属性
  store
}).$mount('#app')
