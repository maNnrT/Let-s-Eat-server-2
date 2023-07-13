// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')
const clone = require('clone')
const data = require('./db.json')
const server = jsonServer.create()
const isProductionEnv = process.env.NODE_ENV === 'production';
const router = jsonServer.router(isProductionEnv ? clone(data) : 'db.json', {
    _isFake: isProductionEnv
})
const middlewares = jsonServer.defaults()
server.use(middlewares)
// Add this before server.use(router)
server.use((req, res, next) => {
    if (req.path !== '/')
        router.db.setState(clone(data))
    next()
})
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
