import { reqCartList, reqAddOrUpdateShopCart, reqDeleteCartById, reqUpdateCheckedByid } from '@/api';
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
    if (result.code == 200) { commit("GETCARTLIST", result.data); }
  },
  //将购物车中产品的数量修改到数据库中
  async addOrUpdateShopCart({ commit }, { skuid, skuNum }) {
    let result = await reqAddOrUpdateShopCart(skuid, skuNum);
  },
  //删除购物车某一个产品
  async deleteCartListBySkuId({ commit }, skuId) {
    let result = await reqDeleteCartById(skuId);
    if (result.code == 200) {
      return "ok";
    } else { return Promise.reject(new Error("faile")); }
  },

  // 更改商品的选中状态
  async updateCheckedById({ commit }, { skuId, isChecked }) {
    let result = await reqUpdateCheckedByid(skuId, isChecked);
    if (result.code == 200) {
      return "ok";
    } else { return Promise.reject(new Error("修改状态失败faile")); }
  }
};
const getters = {
  cartList(state) {
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