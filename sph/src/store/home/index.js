import { reqCategoryList } from '@/api'
// home模块的小仓库

//state:仓库存储数据的地方
const state = {
  //state中数据默认初始值别瞎写,服务器返回的是对象，这里就要用{}，若是数组，则用[]
  categoryList: [],
};

//mutations:修改state的唯一手段
const mutations = {
  CATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList.slice(0, 16)
    // state.categoryList = categoryList
  }
};

//action:处理action,可以书写自己的业务逻辑，也可以处理异步
const actions = {
  // 这里可以书写业务逻辑，但是不能修改state
  // 通过API里面的接口函数调用，向服务器发请求，获取服务器的数据
  async categoryList({ commit }) {
    let result = await reqCategoryList();
    if (result.code == 200) {
      commit("CATEGORYLIST", result.data);
    }
  }
};

//getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {};



//对外暴露仓库(store类的一个实例)
//第一个注意:需要关键字new，你没有new会报错的
//第二个注意:Store构造函数,书写的时候别小写
export default ({
  //大仓库需要注册全部小仓库
  //vuex新增的一个配置项:模块式开发.右侧V也是对象
  state,
  mutations,
  actions,
  getters,
  namespaced: true,


})