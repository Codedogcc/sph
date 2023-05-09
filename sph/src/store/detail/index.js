import { reqGoodsInfo } from '@/api';

const state = {
  goodInfo: {},
};
const mutations = {
  GETGOODINFO(state, goodInfo) {
    state.goodInfo = goodInfo; // 保存品牌详情到state中
  }

};
const actions = {
  // 获取产品信息的action
  async getGoodsInfo({ commit }, skuid) {
    let result = await reqGoodsInfo(skuid)
    if (result.code == 200) {
      commit('GETGOODINFO', result.data);
    }
  }
};
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