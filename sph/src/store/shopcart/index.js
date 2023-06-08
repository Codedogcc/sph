import { reqCartList } from '@/api';
const state = {
  cartList: []
};

const mutations = {
  GETCARTLIST(state, cartList) { state.cartList = cartList; }
};
const actions = {
  // 用户注册
  async getCartList({ commit }) {
    let result = await reqCartList()
    console.log("result---shopcart的获取购物车信息store", result);
    if (result.code == 200) { commit("GETCARTLIST", result.data); }
  },
};
const getters = {
  cartList(state) {
    console.log(state, "steatesa");
    return state.cartList[0] || {}
  },
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