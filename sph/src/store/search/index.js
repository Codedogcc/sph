// search模块的小仓库

//state:仓库存储数据的地方
const state = {};

//mutations:修改state的唯一手段
const mutations = {
};

//action:处理action,可以书写自己的业务逻辑，也可以处理异步
const actions = {
  // 这里可以书写业务逻辑，但是不能修改state
};

//getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {};


//大仓库需要注册全部小仓库
//vuex新增的一个配置项:模块式开发.右侧V也是对象
state,
  mutations,
  actions,
  getters



//对外暴露仓库(store类的一个实例)
//第一个注意:需要关键字new，你没有new会报错的
//第二个注意:Store构造函数,书写的时候别小写
export default new Vuex.Store({
  //大仓库需要注册全部小仓库
  //vuex新增的一个配置项:模块式开发.右侧V也是对象
  state,
  mutations,
  actions,
  getters



})