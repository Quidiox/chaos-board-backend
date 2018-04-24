if (process.env.NODE_ENV !== 'production') require('dotenv').config()

module.exports =
  process.env.NODE_ENV === 'development'
    ? {
        port: process.env.PORT,
        mongoUrl: process.env.MONGODB_URL
      }
    : {
        port: process.env.TEST_PORT,
        mongoUrl: process.env.TEST_MONGODB_URL
      }
