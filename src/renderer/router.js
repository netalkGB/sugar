import Vue from 'vue'
import Router from 'vue-router'
import SelectUser from './views/SelectUser'
import AddUser from './views/AddUser'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SelectUser',
      component: SelectUser
    },
    {
      path: '/adduser',
      name: 'adduser',
      component: AddUser
    }
  ],
  mode: 'hash'
})
