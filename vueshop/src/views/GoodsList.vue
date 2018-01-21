<template>
    <div>
      <nav-header></nav-header>
      <nav-breader></nav-breader>
      <div class="accessory-result-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">排序:</span>
            <a href="javascript:void(0)" class="default cur" @click='defaultSort'>默认</a>
            <a href="javascript:void(0)" class="price" :class="{'sort-up':sortFlag}" @click='sortGoods'>价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby" @click.stop="showFilterPop">筛选</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter" id="filter" :class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>价格区间:</dt>
                <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{'cur':priceChecked=='all'}">选择价格</a></dd>
                <dd v-for="(item,index) in priceFilter">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked==index}">￥ {{item.startPrice}} - {{item.endPrice}} 元</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                    <li v-for="item in goodsList">
                      <div class="pic">
                        <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                      </div>
                      <div class="main">
                        <div class="name">{{item.productName}}</div>
                        <div class="price">{{item.salePrice}}</div>
                        <div class="btn-area">
                          <a href="javascript:;" @click="addCart(item.productId)" class="btn btn--m">加入购物车</a>
                        </div>
                      </div>
                    </li>
                </ul>
              </div>
              <div class="view-more-normal"
              v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy"
                   infinite-scroll-distance="20">
                  <img src="./../../static/loading-svg/loading-spinning-bubbles.svg" v-show="loading"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="filterBy" @click="closePop"></div>
      <nav-footer></nav-footer>
    </div>
</template>

<script>
import "./../assets/css/base.css"
import "./../assets/css/goods-list.css"
import NavHeader from "./../components/NavHeader"
import NavFooter from "./../components/NavFooter"
import NavBreader from "./../components/NavBreader"
import axios from "axios"
var baseUrl = 'http://localhost:3000';
export default {
  name: 'goods-list',
  data(){
    return{
      goodsList:[],
      priceChecked:"all",
      sortFlag:true,
      page:1,
      pageSize:8,
      filterBy:false,
      busy:true,
      loading:false,
      priceFilter:[
      {
        startPrice:'0.00',
        endPrice:'100.00'
      },
      {
        startPrice:'100.00',
        endPrice:'500.00'
      },
      {
        startPrice:'500.00',
        endPrice:'1000.00'
      },
      {
        startPrice:'1000.00',
        endPrice:'2000.00'
      },
      {
        startPrice:'2000.00',
        endPrice:'3000.00'
      },
      {
        startPrice:'3000.00',
        endPrice:'6000.00'
      }
    ]
    }
  },
  components:{
    NavHeader:NavHeader,
    NavFooter:NavFooter,
    NavBreader:NavBreader
  },
  methods:{
    //获取列表数据
    getGoodsList(flag){
      this.loading = true;
      var param = {
        page:this.page,
        pageSize:this.pageSize,
        sort:this.sortFlag?1:-1,
        priceLevel:this.priceChecked
      }
      axios.get(baseUrl+"/goods/list",{params:param}).then((result)=>{
        console.log(result)
        this.loading = false;
        var data = result.data
        if (data.status =='0'){
          if(flag){
            this.goodsList = this.goodsList.concat(data.result.list)
            if (data.result.count == 0){
              this.busy = true
            }else {
              this.busy =false
            }
          }else{
            this.goodsList = data.result.list;
            this.busy = false;
          }
        }else{
          this.goodsList = [];
        }
      })
    },
    //设置price的过滤
    setPriceFilter(index){
      this.priceChecked = index;
      this.page = 1;
      this.getGoodsList();
    },
    //显示价格过滤弹框
    showFilterPop(){
      this.filterBy = true;
    },
    //关闭
    closePop(){
      this.filterBy= false;
    },
    //商品排序
    sortGoods(){
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    //默认排序
    defaultSort(){
      this.sortFlag = true;
      this.page = 1;
      this.getGoodsList();
    },
    loadMore(){
      this.busy = true;
      setTimeout(()=>{
        this.page++;
        this.getGoodsList(true)
      },500)
    },
    //加入购物车
    addCart(productId){
      axios.post(baseUrl+"/goods/addCart",{productId:productId}).then(function(result){
        if (result.data.status == 0){
          alert("加入成功");
        }else {
          alert(result.data.msg);
        }
      })
    }
  },
  mounted(){
    this.getGoodsList();
  }
}
</script>

<style scoped>

</style>
