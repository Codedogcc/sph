<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <p v-if="!userName">
            <span>请</span>
            <router-link to="/login">登录</router-link>
            <router-link class="register" to="/register">注册</router-link>
          </p>
          <p v-else>
            <span>{{ userName }}</span>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="goSearch()"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue';
export default {
  name: '',
  data() {
    return {
      keyword: ''
    };
  },
  methods: {
    // 搜索按钮的回调函数: 需要向search路由进行跳转
    goSearch() {
      //路由传递参数
      //第0种字符串形式
      // this.$router.push(
      //   '/search/' + this.keyword + '?k=' + this.keyword.toUpperCase()
      // );

      //第一种传递query参数
      // this.$router.push({path:'/search',query:{keyword:this.keyword}});

      //第二种传递params参数 [一定要注意,面试的时候经常问]
      // this.$router.push({name:'search',params:{keyword:this.keyword}})

      // 第三种传递query+params，对象写法
      let location = {
        name: 'search',
        params: { keyword: this.keyword || undefined }
        // query: { keyword: this.keyword.toUpperCase() },
      };
      // 如果有query函数就得一起带过去
      console.log('this.$route.query', this.$route.query);
      if (this.$route.query != {}) {
        location.query = this.$route.query;
      }
      this.$router.push(location);

      // 第四种模板字符串
      // let result = this.$router.push(
      //   `/search/${this.keyword}?k=${this.keyword.toUpperCase()}`
      // );
      // console.log('result', result);  // 打印可看出result是一个promise
      // 第四种模板字符串
      // this.$router.push(
      //   `/search/${this.keyword}?k=${this.keyword.toUpperCase()}`
      // );
    },
    // 退出登录
    async logout() {
      try {
        await this.$store.dispatch('user/userLogout');
        this.$router.push('/home');
      } catch (error) {}
    }
  },
  mounted() {
    //通过全局事件总线清除关键字
    this.$bus.$on('del-keyword', () => {
      console.log('通过全局事件总线清除关键字');
      this.keyword = ''; // 清空input框中的值
    });
  },
  computed: {
    // 用户名信息
    userName() {
      return this.$store.state.user.userInfo.name;
    }
  }
};
</script>

<style scoped lang="less">
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>