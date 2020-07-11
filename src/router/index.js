import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
// import Home from '../components/home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
// import Welcome from '../components/welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')

// import Users from '../components/user/users.vue'
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/user/users.vue')
// import Rights from '../components/power/rights.vue'
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/rights.vue')
// import Roles from '../components/power/roles.vue'
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/roles.vue')

// import Cate from '../components/goods/cate.vue'
const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/cate.vue')
// import Params from '../components/goods/params.vue'
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/params.vue')

// import GoodsList from '../components/goods/list.vue'
const GoodsList = () => import(/* webpackChunkName: "goodslist_addgoods" */ '../components/goods/list.vue')
// import AddGoods from '../components/goods/add.vue'
const AddGoods = () => import(/* webpackChunkName: "goodslist_addgoods" */ '../components/goods/add.vue')

// import Order from '../components/order/order.vue'
const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/order.vue')
// import Report from '../components/report/report.vue'
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/report.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/addgoods', component: AddGoods },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要进入的路由对象
  // from 从哪个路径跳转来
  // next() 放行函数 加路径可强制跳转
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
