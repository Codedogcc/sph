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

  // 删除全部勾选的产品
  deleteAllCheckedCart({ dispatch, getters, state, commit }) {
    //context:小仓库，commit[提交mutations修改state] getters [计算属性] dispatch[派发action] state[当前仓库数据)
    //获取购物车中全部的产品 (是一个数组)
    let PromiseAll = [];
    getters.cartList.cartInfoList.forEach(item => {
      let promise = item.isChecked == 1 ? dispatch('deleteCartListBySkuId', item.skuId) : '';
      //将每一次返回的Promise添加到数组当中
      PromiseAll.push(promise);
    }   )
    // 只要全部的promise都成功，返回结果即为成功，如果有一个失败，则返回失败
    return Promise.all(PromiseAll)
  },

  // 更改商品的选中状态
  async updateCheckedById({ commit }, { skuId, isChecked }) {
    let result = await reqUpdateCheckedByid(skuId, isChecked);
    if (result.code == 200) {
      return "ok";
    } else { return Promise.reject(new Error("修改状态失败faile")); }
  },

  // 更改全部商品的选中状态
  async checkAllCart({ dispatch, state }, isChecked) {
    // let result = await reqUpdateCheckedByid(isChecked);
    // if (result.code == 200) {
    //   return "ok";
    // } else { return Promise.reject(new Error("修改状态失败faile")); }
    console.log("dispatch", dispatch, "state", state, "isChecked", isChecked);
    let PromiseAll = [];
    state.cartList[0].cartInfoList.forEach(item => {
      // item.isChecked != isChecked ? dispatch('updateCheckedById', { skuId: item.skuId, isChecked }) : '';
      let promise = dispatch('updateCheckedById', { skuId: item.skuId, isChecked })
      PromiseAll.push(promise);
    })
    // 只要全部的promise都成功，返回结果即为成功，如果有一个失败，则返回失败
    return Promise.all(PromiseAll)
  },
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