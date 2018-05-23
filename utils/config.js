if (process.env.NODE_ENV !== 'production') require('dotenv').config()

module.exports =
  process.env.NODE_ENV === 'development'
    ? {
        port: process.env.DEV_PORT,
        mongoURI: process.env.DEV_MONGODB_URI
      }
    : {
        port: process.env.TEST_PORT,
        mongoURI: process.env.TEST_MONGODB_URI
      }
