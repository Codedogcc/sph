<template>
  <!-- 右侧内容 -->
  <div class="order-right">
    <div class="order-content">
      <div class="title">
        <h3>我的订单</h3>
      </div>
      <div class="chosetype">
        <table>
          <thead>
            <tr>
              <th width="29%">商品</th>
              <th width="31%">订单详情</th>
              <th width="13%">收货人</th>
              <th>金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="orders">
        <table
          class="order-item"
          v-for="(item, index) in myOrder.records"
          :key="item.id"
        >
          <thead>
            <tr>
              <th colspan="5">
                <span class="ordertitle"
                  >{{ item.createTime }}　订单编号：{{ item.outTradeNo }}
                  <span class="pull-right delete"
                    ><img src="../images/delete.png" /></span
                ></span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in item.orderDetailList" :key="item.id">
              <td width="60%">
                <div class="typographic">
                  <img :src="item.imgUrl" style="width: 100px; height: 100px" />
                  <a href="#" class="block-text">{{ item.skuName }}</a>
                  <span>x{{ item.skuNum }}</span>
                  <a href="#" class="service">售后申请</a>
                </div>
              </td>
              <td
                :rowspan="item.orderDetaillist.length"
                v-if="index == 0"
                width="8%"
                class="center"
              >
                {{ item.consignee }}
              </td>
              <td
                :rowspan="item.orderDetaillist.length"
                v-if="index == 0"
                width="13%"
                class="center"
              >
                <ul class="unstyled">
                  <li>总金额¥{{ item.totalAmount }}</li>
                  <li>在线支付</li>
                </ul>
              </td>
              <td
                :rowspan="item.orderDetaillist.length"
                v-if="index == 0"
                width="8%"
                class="center"
              >
                <a href="#" class="btn">{{ item.orderstatusName }} </a>
              </td>
              <td
                :rowspan="item.orderDetaillist.length"
                v-if="index == 0"
                width="13%"
                class="center"
              >
                <ul class="unstyled">
                  <li>
                    <a href="mycomment.html" target="_blank">评价|晒单</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="choose-order">
        <!-- 分页器 -->
        <Pagination
          :pageNo="page"
          :pageSize="limit"
          :total="myOrder.total"
          continues="5"
          @currentChange="currentChange"
        >
        </Pagination>
      </div>
    </div>
    <!--猜你喜欢-->
    <div class="like">
      <h4 class="kt">猜你喜欢</h4>
      <ul class="like-list">
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike01.png" />
          </div>
          <div class="attr">
            <em>DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</em>
          </div>
          <div class="price">
            <em>¥</em>
            <i>3699.00</i>
          </div>
          <div class="commit">已有6人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike02.png" />
          </div>
          <div class="attr">Apple苹果iPhone 6s/6s Plus 16G 64G 128G</div>
          <div class="price">
            <em>¥</em>
            <i>4388.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike03.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike04.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      //初始化参数
      //当前第几页
      page: 1,
      //每一页展示数据个数
      limit: 3,
      //存储我的订单的数据
      myOrder: {}
    };
  },
  mounted() {
    //获取我的订单的数据方法
    // this.getData();
  },
  methods: {
    //获取我的订单
    async getData() {
      //解构出参数
      const { page, limit } = this;
      let res = await this.$API.reqMyOrderList(); //这里用模拟接口，就不传参数了
      console.log(res, 'res请求我的订单的结果');
      if (res.code == 200) {
        this.myOrder = res.data.data;
      }
    },
    // 改变页码
    currentChange(page) {
      //修改组件响应式数据page
      this.page = page;
      this.getData(); //获取新数据
    }
  }
};
</script>

<style>
</style>