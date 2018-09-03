import Vue from 'vue'
import App from './App'
import log4js from 'log4js'

const logger = log4js.getLogger('renderer')
logger.level = process.env.NODE_ENV === 'development' ? 'all' : 'warn'
logger.debug('development mode.')

Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
