
// 引入路由组件
// import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Detail from '@/pages/Detail';
import AddCartSuccess from '@/pages/AddCartSuccess';
import ShopCart from '@/pages/ShopCart';
import Trade from '@/pages/Trade';
import Pay from '@/pages/Pay';
import PaySuccess from '@/pages/PaySuccess';
import Center from '@/pages/Center';

// 引入二级路由组件
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'

const foo = () => {
  return import("@/pages/Home")
}

// 当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。
// 如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，
// 这样就会更加高效。

// 路由的配置信息
export default [
  {
    path: '/center',
    component: Center,
    meta: { show: true },
    //二级路由组件
    children: [
      {
        path: "myorder",
        component: MyOrder,
      },
      {
        path: "grouporder",
        component: GroupOrder,
      },
      {
        path: '/center',
        redirect: '/center/myorder'
      }
    ]
  },
  {
    path: '/paysuccess',
    component: PaySuccess,
    meta: { show: true },
  },
  {
    path: '/pay',
    component: Pay,
    meta: { show: true },
    //路由独享守卫
    beforeEnter: (to, from, next) => {
      if (from.path == "/trade") {
        next();
      } else {
        next(false);
      }
    }
  },
  {
    path: '/trade',
    component: Trade,
    meta: { show: true },
    //路由独享守卫
    beforeEnter: (to, from, next) => {
      if (from.path == "/shopcart") {
        next();
      } else {
        next(false);
      }
    }
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
    component: foo,// 懒加载的写法
    meta: { show: true },
  },
  {
    name: 'search',
    //在注册路由的时候,如果这里占位，切记务必要传递params，当params后面带有问号的时候，这时就可传可不传
    path: '/search/:keyword?',
    component: () => import('@/pages/Search'),  // 懒加载写法
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