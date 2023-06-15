//vue插件一定暴露一个对象
let myPlugins = {};
myPlugins.install = function (Vue, options) {
  //vue.prototype.$bus:任何组件都可以使用
  //Vue.directive
  //Vue . component
  //Vue.filter...
  Vue.directive(options.name, (element, params) => {
    console.log("element", element);
    console.log("bbbb", params);
    element.innerHTML = params.value.toUpperCase();

  })
}
export default myPlugins;