import log4js from 'log4js'

const logger = log4js.getLogger('renderer')
logger.level = process.env.NODE_ENV === 'development' ? 'all' : 'warn'

export default logger
