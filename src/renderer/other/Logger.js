
const logger = window.log4js.getLogger('renderer')
logger.level = process.env.NODE_ENV === 'development' ? 'all' : 'warn'

export default logger
