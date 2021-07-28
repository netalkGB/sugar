import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SelectUser',
      component: () => import('@/views/SelectUser')
    },
    {
      path: '/adduser',
      name: 'adduser',
      component: () => import('@/views/AddUser')
    },
    {
      path: '/user/:userId',
      component: () => import('@/views/Main'),
      props: route => ({ userId: Number(route.params.userId) }),
      children: [
        {
          name: 'home_timeline',
          path: 'home_timeline',
          component: () => import('@/views/HomeTimeline')
        },
        {
          name: 'local_timeline',
          path: 'local_timeline',
          component: () => import('@/views/LocalTimeline')
        },
        {
          name: 'public_timeline',
          path: 'public_timeline',
          component: () => import('@/views/PublicTimeline')
        },
        {
          name: 'notification',
          path: 'notification',
          component: () => import('@/views/Notification')
        }
      ]
    },
    {
      name: 'new_toot',
      path: '/newtoot/:userId',
      props: route => ({
        userId: Number(route.params.userId),
        inReplyToID: String(route.query.inReplyToID),
        destinations: String(route.query.destinations)
      }),
      component: () => import('@/views/NewToot')
    },
    {
      name: 'conversation',
      path: '/conversation/:userId',
      props: route => ({
        userId: Number(route.params.userId),
        id: String(route.query.id)
      }),
      component: () => import('@/views/Conversation')
    },
    {
      name: 'profile',
      path: '/profile/:userId/:internalId',
      props: route => ({
        userId: Number(route.params.userId),
        internalId: String(route.params.internalId)
      }),
      component: () => import('@/views/Profile')
    },
    {
      name: 'image_preview',
      path: '/imagepreview/:url',
      props: route => ({
        url: String(route.params.url)
      }),
      component: () => import('@/views/ImagePreview')
    },
    {
      name: 'searchWindow',
      path: '/search/:userId',
      props: route => ({
        userId: Number(route.params.userId),
        word: String(route.query.word)
      }),
      component: () => import('@/views/Search')
    },
    {
      name: 'favouriteWindow',
      path: '/favourite/:userId',
      props: route => ({
        userId: Number(route.params.userId),
        screenName: String(route.query.screenName)
      }),
      component: () => import('@/views/Favourite')
    }
  ],
  mode: 'hash'
})
