import Vue from 'vue'
import Vuex from 'vuex'
import users from './stores/users'
import timelines from './stores/timelines'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    users,
    timelines
  }
})
export default store
