// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')
const clone = require('clone')
const data = require('./db.json')
const server = jsonServer.create()

const middlewares = jsonServer.defaults()

// For mocking the POST request, POST request won't make any changes to the DB in production environment
const router = jsonServer.router(isProductionEnv ? clone(data) : 'db.json', {
    _isFake: isProductionEnv
})

server.use(middlewares)

server.use((req, res, next) => {
    if (req.path !== '/')
        router.db.setState(clone(data))
    next()
})
// Add this before server.use(router)
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}))
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
