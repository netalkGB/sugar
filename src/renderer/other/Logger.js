const NODE_ENV = window.NODE_ENV
const logger = window.log4js.getLogger('renderer')
logger.level = NODE_ENV === 'development' ? 'all' : 'warn'

export default logger
