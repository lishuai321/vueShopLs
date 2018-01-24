// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload';
import VueInfiniteScroll from 'vue-infinite-scroll';
import axios from 'axios';
axios.defaults.withCredentials = true;
Vue.use(VueInfiniteScroll);
Vue.use(ElementUI);
Vue.use(VueLazyload,{
  loading:"static/loading-svg/loading-bars.svg",
  attemp:3
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
