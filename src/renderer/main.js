import Vue from 'vue'
import App from './App'
import Buefy from 'buefy'
import router from './router'
import store from './store'
import logger from './other/Logger'
import '../../node_modules/buefy/lib/buefy.css'
logger.debug('development mode.')

Vue.config.productionTip = false

Vue.use(Buefy)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
