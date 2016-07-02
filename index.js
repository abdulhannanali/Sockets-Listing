const express = require("express")
const http = require("http")

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || "0.0.0.0"

const app = express()
const server = http.createServer(app)

const io = require("socket.io")(server)

// SocketIO consumer libraries
require("./io")(io)


app.use(express.static(__dirname + "/public"))

server.listen(PORT, HOST, function (error) {
	if (!error) {
		console.log(`Server is listening on ${HOST}:${PORT}`)
	}
})