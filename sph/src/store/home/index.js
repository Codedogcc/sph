import { reqCategoryList, reqGetBannerList, reqFloorList } from '@/api'
// home模块的小仓库

//state:仓库存储数据的地方
const state = {
  //state中数据格式别瞎写,重点看接口返回的数据格式，如果服务器返回的是对象，这里就要用{}，若是数组，则用[]
  categoryList: [],
  //轮播图的数据
  bannerList: [],
  //floor组件的数据
  floorList: [],
};

//mutations:修改state的唯一手段
const mutations = {
  CATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList.slice(0, 16)
    // state.categoryList = categoryList
  },
  BANNERLIST(state, bannerList) {
    state.bannerList = bannerList
    console.log('渲染轮播图数据');
  },
  FLOORLIST(state, floorList) {
    state.floorList = floorList
    console.log('渲染FloorList数据');
  },
};

//action:处理action,可以书写自己的业务逻辑，也可以处理异步
const actions = {
  // 这里可以书写业务逻辑，但是不能修改state
  // 通过API里面的接口函数调用，向服务器发请求，获取服务器的数据
  async categoryList({ commit }) {
    let result = await reqCategoryList();
    console.log('resule-categoryList的store', result)
    if (result.code == 200) {
      commit("CATEGORYLIST", result.data);
    }
  },
  // 获取首页轮播图的数据
  async getBannerList({ commit }) {
    let result = await reqGetBannerList();
    console.log('resule-getBannerList', result)
    if (result.code == 200) {
      commit("BANNERLIST", result.data);
      console.log("获得轮播图数据并传给mutation");
    }
  },

  // 获取首页轮播图的数据
  async getFloorList({ commit }) {
    let result = await reqFloorList();
    console.log('resule-getFloorList', result)
    if (result.code == 200) {
      commit("FLOORLIST", result.data);
      console.log("获得FloorList数据并传给mutation");
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