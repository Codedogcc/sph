import { reqAddressInfo, reqOrderInfo, reqMockAddress, reqMockOrderInfo } from '@/api';
const state = {
  address: [],
  orderInfo: []
};

const mutations = {
  GETUSERADDRESS(state, address) {
    state.address = address;
  },
  GETORDERINFO(state, orderInfo) {
    state.orderInfo = orderInfo;
  }
};
const actions = {
  // 获取用户地址信息
  // async getUserAddress({ commit }) {
  //   let result = await reqAddressInfo();
  //   if (result.code == 200) {
  //     commit('GETUSERADDRESS', result.data);
  //   }
  // },
  async getUserAddress({ commit }) {
    let result = await reqMockAddress();
    if (result.code == 200) {
      commit('GETUSERADDRESS', result.data);
    }
  },
  // 获取商品清单
  //获取商品清单数据
  async getOrderInfo({ commit }) {
    // let result = await reqOrderInfo();// 原接口获取不到数据，改用自己mock的接口
    let result = await reqMockOrderInfo();
    console.log("获取商品清单RESULE", result);
    if (result.code == 200) {
      commit('GETORDERINFO', result.data);
    }
  }
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