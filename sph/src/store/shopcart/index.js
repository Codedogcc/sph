import { reqCartList } from '@/api';
const state = {
  
};

const mutations = {

};
const actions = {
  // 用户注册
  async getCartList({ commit }) {
    let result = await reqCartList()
    console.log("result---shopcart的获取购物车信息store", result);
  },
};
const getters = {
};

export default ({
  //大仓库需要注册全部小仓库
  //vuex新增的一个配置项:模块式开发.右侧V也是对象
  state,
  mutations,
  actions,
  getters,
  namespaced: true,


})