import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['../views/Login'], resolve)
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {title:'home'}
    },{
      path: '/my',
      name: 'my',
      component: resolve => require(['../views/my_edit'], resolve),
      meta: {title:'个人中心'}
    },{
      path: '/onelist',
      name: 'onelist',
      component: resolve => require(['../views/onelist'], resolve)
    },
  ]
})
