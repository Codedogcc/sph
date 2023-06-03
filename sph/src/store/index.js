//仓库
import Vuex from 'vuex';
import Vue from 'vue';
//安装插件
Vue.use(Vuex);
// 引入小仓库
import home from './home';
import search from './search';
import detail from './detail';
import user from './user';

//对外暴露仓库(store类的一个实例)
//第一个注意:需要关键字new，你没有new会报错的
//第二个注意:Store构造函数,书写的时候别小写
export default new Vuex.Store({
  // 实现vuex仓库模块式开发存储数据
  modules: {
    home,
    search,
    detail,
    user,
  }
})