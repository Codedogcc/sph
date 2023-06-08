import { reqGoodsInfo, reqAddOrUpdateShopCart } from '@/api';
import { getUUID } from '@/utils/uuid_token';
const state = {
  goodInfo: {

  },
  //游客临时身份
  uuid_token: getUUID()
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
  },
  //将产品添加到购物车中
  async addOrUpdateShopCart({ commit }, { skuid, skuNum }) {
    //加入购物车返回的解构
    //加入购物车返回的解构
    //加入购物车以后(发请求) ，前台将参数带给服务器
    //服务器写入数据成功， 并没有返回其他的数据，只是返回code=200，代表这次操作成功//因为服务器没有返回其余数据，因此咱们不需要三连环存储数据
    let result = await reqAddOrUpdateShopCart(skuid, skuNum);
    // 代表服务器加入购物车成功
    // if (result.code == 200) {
    //   return "ok"
    // } else {
    //   return promise.reject(new Error('faile'));
    //   // 当前的这个函数如果执行返回Promise
    // }
  }
};

//简化数据而生
const getters = {
  categoryView(state) {
    return state.goodInfo.categoryView || {};
  },
  skuInfo(state) {
    return state.goodInfo.skuInfo || {};
  },
  price(state) {
    return state.goodInfo.price || 0;
  },
  spuSaleAttrList(state) {
    return state.goodInfo.spuSaleAttrList || [];
  },
  skuImageList(state) {
    return state.goodInfo.skuInfo?.skuImageList || [];
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