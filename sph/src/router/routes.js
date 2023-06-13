// 路由的配置信息
// 引入路由组件
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Detail from '@/pages/Detail';
import AddCartSuccess from '@/pages/AddCartSuccess';
import ShopCart from '@/pages/ShopCart';
import Trade from '@/pages/Trade';
import Pay from '@/pages/Pay';
export default [
  {
    path: '/pay',
    component: Pay,
    meta: { show: true },
  },
  {
    path: '/trade',
    component: Trade,
    meta: { show: true },
  },
  {
    path: '/shopcart',
    component: ShopCart,
    //meta路由元信息,新学习的一个配置项
    //它的右侧是一个对象[可以有多个键值对]
    //路由配置项：书写的时候不要胡写、乱写、瞎写【在VC组件身上获取不到,没有任何意义】
    meta: { show: true },
  },
  {
    path: '/addcartsuccess',
    component: AddCartSuccess,
    name: 'addcartsuccess',
    //meta路由元信息,新学习的一个配置项!!!!给当前路由添加一些额外数据
    //它的右侧是一个对象[可以有多个键值对]
    //路由配置项：书写的时候不要胡写、乱写、瞎写【在VC组件身上获取不到,没有任何意义】
    meta: { show: true },
  },
  {
    // 路由的路径一定是小写
    path: '/detail/:skuid',
    component: Detail,
    meta: { show: true },
  },
  {
    path: '/home',
    //命名路由,给路由起一个名字
    name: 'erha',
    component: Home,
    meta: { show: true },
  },
  {
    name: 'search',
    //在注册路由的时候,如果这里占位，切记务必要传递params，当params后面带有问号的时候，这时就可传可不传
    path: '/search/:keyword?',
    component: Search,
    meta: { show: true },
    //新增配置项:props,给路由组件传递props参数
    //第一种布尔模式,相当于把params参数，作为props属性值传递给这个路由组件
    // props:true,

    //第二种:对象形式
    // props:{a:1,b:'我爱你'}

    //第三种写法:函数写法.一般是把query参数与params参数当中props传递给路由组件!!!
    //route就是当前路由
    // props:(route)=>{
    //      //是将当前箭头函数返回结果，作为props传递给search路由组件!!!
    //      return {a:route.params.keyword,b:'可以传递参数'};
    // }
  },
  {
    path: '/login',
    component: Login,
    meta: { show: false },
  },
  {
    path: '/register',
    component: Register,
    meta: { show: false },
  },
  //重定向到首页
  {
    path: '/',
    redirect: '/home'
  },
]