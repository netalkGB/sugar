import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import logger from './other/Logger'
import 'vue-ionicons/ionicons.css'
logger.debug('development mode.')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
