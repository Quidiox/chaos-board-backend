if (process.env.NODE_ENV !== 'production') require('dotenv').config()

module.exports =
  process.env.NODE_ENV === 'test'
    ? {
        port: process.env.TEST_PORT,
        mongoURI: process.env.TEST_MONGODB_URI
      }
    : {
        port: process.env.PORT,
        mongoURI: process.env.MONGODB_URI
      }
