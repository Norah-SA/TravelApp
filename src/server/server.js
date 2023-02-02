
const app = require('./index')
// Setup Server
const port = 8081
app.listen(port, function () {
    console.log(`http://localhost:${port}`)
})