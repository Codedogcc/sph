//对于axios进行二次封装，为了用它的请求和响应拦截器
import axios from "axios";
//引入进度条，nprogress里面封装的方法有start: 进度条开始 done: 进度条结束
import nprogress from 'nprogress';

//引入相关进度条的样式
import "nprogress/nprogress.css";

// 在当前模块中引入store
import store from '@/store';

//1.利用axios对象的方法create,创建一个axios实例
//2.requests就是axios，只不过稍微配置一下
let requests = axios.create({
  //基础路径,发请求URL携带api【发现:真实服务器接口都携带/api】
  baseURL: "/api",
  //超时的设置
  timeout: 5000
});

//请求拦截器: 在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情
requests.interceptors.request.use(config => {
  //config:配置对象，对象里面有一个属性很重要，headers请求头

  //请求头添加一个字段(userTempId):和后台老师商量好了
  if (store.state.detail.uuid_token) {
    config.headers.userTempId = store.state.detail.uuid_token;
  }

  //需要携带token带给服务器
  if (store.state.user.token) { config.headers.token = store.state.user.token; }

  //进度条开始
  nprogress.start();

  return config;
})

//响应拦截器：请求数据返回会执行
requests.interceptors.response.use((res) => {
  //成功的回调函数: 服务器相应数据回来以后，响应拦截器可以检测到，可以做一些事情
  //进度条结束
  nprogress.done();

  return res.data;

}), (err) => {
  //响应失败的回调函数
  //温馨提示:某一天发请求,请求失败,请求失败的信息打印出来
  alert(err.message);
  //响应失败的回调函数
  return Promise.reject(new Error('fail'));
}



//对外暴露
export default requests;