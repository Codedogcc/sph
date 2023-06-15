<template>
  <div>
    <h1 v-upper="msg"></h1>
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
  data() {
    return {
      msg: 'abc'
    };
  },
  components: {
    Header,
    Footer
  },
  mounted() {
    //通知Vuex发请求，获取数据，存储于仓库当中,派发action获取商品分类的三级列表的数据
    this.$store.dispatch('home/categoryList');
  }
};
</script>

<style>
</style>
