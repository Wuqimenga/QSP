
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/edit.css'
import VHeader from './pages/public/VHeader.vue'
import echarts from 'echarts'
import $ from 'jquery'
import 'bootstrap'
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$http=axios;
Vue.component('vheader',VHeader)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

//在路由之前，查看是否需要登录认证
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(r => r.meta.requireAuth)) {
//       if (localStorage.getItem("token")) {
//           next();
//       }
//       else {
//           next({
//               path: '/login',
//               query: {redirect: to.fullPath}
//           })
//       }
//   }
//   else {
//       next();
//   } 
// })