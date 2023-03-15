<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口的地方 -->
    <router-view></router-view>
    <!-- 发现底部的Footer会随着路由的变化进行显示与隐藏 -->
    <Footer v-show="$route.meta.show"></Footer>
    <!-- 分页器务必知道四个条件:total pageSize pageNo pagerCount -->
     </div>
</template>

<script>
import Header from './components/Header';
import Footer from './components/Footer';
export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
</style>
