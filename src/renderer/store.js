import Vue from 'vue'
import Vuex from 'vuex'
import users from '@/stores/users'
import timelines from '@/stores/timelines'
import conversation from '@/stores/conversation'
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    users,
    timelines,
    conversation
  }
})
export default store
