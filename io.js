const colors = require("colors/safe")

module.exports = function (io) {
	var socketData = {}

	var IO = io


	io.on("connection", function (socket) {
		console.log("----------------------")
		console.log(colors.green("Socket Connected"))
		console.log(`${socket.id}`)
		console.log("-----------------\n")

		var rooms = []

		socketData[socket.id] = {
			name: "",
			date: Date.now()
		}

		socket.emit("id", socket.id)
		socket.on("disconnect", function () {
			delete socketData[socket.id]
			emitAllData()
			console.log(colors.red("Disconnected"))
		})

		socket.on("name", function (data) {

			if (typeof data == "string") {
				socketData[socket.id]["name"] = data
				emitAllData()
			}
		})

		socket.on("poke", function (data) {
			io.sockets.connected[data["id"]].emit("poke", data["id"])
		})

		socket.on("joinRoom", function (data) {
			if (typeof data == "string") {
				socket.join(data, function (error) {
					if (!error) {
						console.log(`${socket.id} has joined ${data}`)
						socket.emit("joinedRooms", Object.keys(socket.rooms))
					}
				})				
				
			}

		})


		socket.emit("joinedRooms", Object.keys(socket.rooms))
		emitAllData()
	})


	function emitAllData () {
		io.emit("sockets", socketData)
	}

}