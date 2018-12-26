import Vue from 'vue'
import Vuex from 'vuex'
import users from '@/stores/users'
import timelines from '@/stores/timelines'
import conversation from '@/stores/conversation'
import profile from '@/stores/profile'
const NODE_ENV = window.NODE_ENV
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: NODE_ENV !== 'production',
  modules: {
    users,
    timelines,
    conversation,
    profile
  }
})
export default store
