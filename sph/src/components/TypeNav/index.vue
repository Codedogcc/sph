<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <div @mouseleave="leaveIndex()" @mouseenter="enterShow()">
        <h2 class="all">全部商品分类</h2>
        <!-- 三级联动、过渡动画 -->
        <transition name="sort">
          <div class="sort" v-show="show">
            <!-- 利用事件委派+编程式导航实现路由的跳转与传递参数 -->
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item"
                v-for="(item1, index) in categoryList"
                :key="item1.categoryId"
                :class="{ cur: currentIndex == index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="item1.categoryName"
                    :data-category1Id="item1.categoryId"
                    >{{ item1.categoryName }}</a
                  >
                  <!-- <router-link to="/search">
                  {{ item1.categoryName }}
                </router-link> -->
                </h3>
                <!-- 二级、三级分类 -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <div
                    class="subitem"
                    v-for="(item2, index) in item1.categoryChild"
                    :key="item2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="item2.categoryName"
                          :data-category2Id="item2.categoryId"
                          >{{ item2.categoryName }}</a
                        >
                        <!-- <router-link to="/search">
                        {{ item2.categoryName }}
                      </router-link> -->
                      </dt>
                      <dd>
                        <em
                          v-for="(item3, index) in item2.categoryChild"
                          :key="item3.categoryId"
                        >
                          <a
                            :data-categoryName="item3.categoryName"
                            :data-category3Id="item3.categoryId"
                            >{{ item3.categoryName }}</a
                          >
                          <!-- <router-link to="/search">
                          {{ item3.categoryName }}
                        </router-link> -->
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// 最好的引入方式：按需加载
import throttle from 'lodash/throttle';

export default {
  name: 'TypeNav',
  data() {
    return {
      //存储用户鼠标移上哪一个一级分类
      currentIndex: -1,
      show: true,
    };
  },
  //组件挂载完毕:可以向服务器发请求
  mounted() {
    //通知Vuex发请求，获取数据，存储于仓库当中
    this.$store.dispatch('home/categoryList');
    // this.$store.dispatch('home/category',this.n)
    console.log('typeNav组件挂载完毕');
    // typeNav组件挂载完毕的时候，把让show属性变成false
    if (this.$route.path != '/home') {
      this.show = false;
    }
  },
  computed: {
    // ...mapState({
    //   //右侧需要的是一个函数，当使用这个计算属性的时候，右侧函数会立即执行一次
    //   //注入一个参数state，其实即为大仓库中的数据
    //   catagoryList: (state) => {
    //     return state.home.catagoryList;
    //   },
    // }),

    ...mapState('home', { categoryList: 'categoryList' }),
  },
  methods: {
    //鼠标进入修改响应式数据currentIndex属性
    // changeIndex(index) {
    //   this.currentIndex = index;
    // },
    // 运用了lodash.js里面的节流写法  _.throttle
    // throttle回调函数别用箭头函数，可能出现上下文 this的问题
    changeIndex: throttle(function (index) {
      this.currentIndex = index;
    }, 50),
    //一级分类鼠标移出的事件回调
    leaveIndex() {
      this.currentIndex = -1;
      if (this.$route.path != '/home') {
        this.show = false;
      }
    },
    //当鼠标移入的时候，让商品分类列表进行展示
    enterShow() {
      if (this.$route.path != '/home') {
        this.show = true;
      }
    },
    goSearch(event) {
      //最好的解决方案: 编程式导航 + 事件委派
      //存在一些问题:事件委派，是把全部的子节点[h3、dt、d1、em] 的事件委派给父亲节点
      //第一个问题，点击a标签的时候，才会进行路由跳转[怎么能确定点击的一定是a标签]
      //存在另外一个问题: 即使你能确定点击的是a标签， 如何区分是一级、二级、三级分类的标签。

      //第一个问题:把子节点当中a标签，我加上自定义属性data-categoryName，其余的子节点是没有的
      // this.$router.push('/search');
      let element = event.target;
      let { categoryname, category1id, category2id, category3id } =
        element.dataset;
      if (categoryname) {
        //整理路由跳转的参数
        let location = { name: 'search' };
        let query = { categoryName: categoryname };
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }

        //整理完参数
        location.query = query;
        //路由跳转
        this.$router.push(location);
      }
    },
  },
};
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }
        .cur {
          background-color: lightblue;
        }
      }
    }

    // 过渡动画的样式
    // 过渡动画开始状态（进入）
    .sort-enter {
      height: 0px;
      transform: rotate(0deg);
    }

    .sort-enter-to {
      height: 461px;
      transform: rotate(360deg);
    }

    // 定义动画时间、速率
    .sort-enter-active {
      transition: all 0.5s linear;
    }
  }
}
</style>