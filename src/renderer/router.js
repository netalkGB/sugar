import Vue from 'vue'
import Router from 'vue-router'
import SelectUser from './views/SelectUser'
import AddUser from './views/AddUser'
import Main from './views/Main'
import HomeTimeline from './views/HomeTimeline'
import LocalTimeline from './views/LocalTimeline'
import PublicTimeline from './views/PublicTimeline'
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
    },
    {
      path: '/user/:userId',
      component: Main,
      props: route => ({ userId: Number(route.params.userId) }),
      children: [
        {
          name: 'home_timeline',
          path: 'home_timeline',
          component: HomeTimeline
        },
        {
          name: 'local_timeline',
          path: 'local_timeline',
          component: LocalTimeline
        },
        {
          name: 'public_timeline',
          path: 'public_timeline',
          component: PublicTimeline
        }
      ]
    }
  ],
  mode: 'hash'
})
