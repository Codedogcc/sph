import { reqGetCode, reqUserRegister, reqUserLogin, reqGetUserInfo } from '@/api';

const state = {
  code: '', // 验证码字符串，在登录成功后将更改为登录状态，
  token: '', // 用户的token
  userInfo: {},// 用户的信息
};

const mutations = {
  GETCODE(state, code) {
    state.code = code; // 保存品牌详情到state中
  },

  USERLOGIN(state, token) {
    state.token = token; // 保存品牌详情到state中
  },
  GETUSERINFO(state, userInfo) {
    state.userInfo = userInfo; // 保存品牌详情到state中
  },
};
const actions = {
  // 获取验证码
  async getCode({ commit }, phone) {  // 有params则传params，没有params则传空值
    let result = await reqGetCode(phone)
    console.log("result---user的获取验证码的store", result);
    if (result.code == 200) {
      commit("GETCODE", result.data);
    } else {
      return Promise.reject(new Error('faile'));
    }
  },
  // 用户注册
  async userRegister({ commit }, { phone, code, password }) {
    let result = await reqUserRegister({ phone, code, password })
    console.log("result---user的注册store", result);
  },

  // 用户登录【token】
  async userLogin({ commit }, data) {
    let result = await reqUserLogin(data)
    console.log("result---user的登录store", result);
    if (result.code == 200) {
      commit("USERLOGIN", result.data.token);
      return 'ok';
    } else {
      return Promise.reject(new Error('faile'));
    }
  },

  // 获取用户信息
  async getUserInfo({ commit }) {
    let result = await reqGetUserInfo()
    console.log("result---user的用户信息store", result);
    if (result.code == 200) {
      commit("GETUSERINFO", result.data);
    } else {
      return Promise.reject(new Error('faile'));
    }
  },
};
const getters = {
  getCode: state => state.code || '', //获取验证码字符串
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