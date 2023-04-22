// search模块的小仓库
import { reqGetSearchInfo } from "@/api";
//state:仓库存储数据的地方
const state = {
  searchList: {},
};

//mutations:修改state的唯一手段
const mutations = {
  GETSEARCHLIST(state, searchList) {
    state.searchList = searchList;
  },
};

//action:处理action,可以书写自己的业务逻辑，也可以处理异步
const actions = {
  //获取search模块数据
  //params形参: 是当用户派发action的时候，第二个参数传递过来的，至少是一个空对象
  async getSearchList({ commit }, params = {}) {  // 有params则传params，没有params则传空值
    let result = await reqGetSearchInfo(params)
    console.log("result---search的store", result, "result---search的params", params);
    if (result.code == 200) {
      commit("GETSEARCHLIST", result.data);
    }
  }
};

//getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
  //当前形参state,当前仓库中的state，并非大仓库中的那个state
  goodsList(state) {
    return state.searchList.goodsList || []  // 这样书写是有问题的
  },
  trademarkList(state) {
    return state.searchList.trademarkList || [] // 这样书写是有问题的
  },
  attrsList(state) {
    return state.searchList.attrsList || [] // 这样书写是有问题的
  },

};


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