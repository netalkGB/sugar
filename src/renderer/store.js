import Vue from 'vue'
import Vuex from 'vuex'
import users from '@/stores/users'
import timelines from '@/stores/timelines'
import conversation from '@/stores/conversation'
import profile from '@/stores/profile'
import search from '@/stores/search'
import favourite from '@/stores/favourite'
const NODE_ENV = window.NODE_ENV
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: NODE_ENV !== 'production',
  modules: {
    users,
    timelines,
    conversation,
    profile,
    search,
    favourite
  }
})
export default store
