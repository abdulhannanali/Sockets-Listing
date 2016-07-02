(function () {
	var status = $("#status")
	var socketId = $("#socketId")

	var socketsTable = $("#socketsTable")
	var socketsTableBody = socketsTable.children("tbody")

	var nameInput = $("#nameInput")
	var nameBtn = $("#nameSubmit")

	var pokeID = $("#pokeID")
	var pokeDisplay = $("#pokeDisplay")

	var joinedRoomsList = $("#joinedRoomsList")

	var roomBtn = $("#roomSubmitBtn")
	var roomInput = $("#roomInput")

	var poke = document.createElement("audio")
	poke.src = "audio/poke.mp3"

	$(document).ready(function () {
		var connectionStatus = false
		var id = ""

		var socket = io("/")

		socket.on("connect", function () {
			connectionStatus = true
			status.html("<h2>Connection Status: <span class='text-success'>Connected</span></h2>")			
		})

		socket.on("id", function (data) {
			id = data
			socketId.html("<h2>Your socket id is <span class='text-primary'>" + id + "</span></h2>")
			socketId.show()
		})

		socket.on("sockets", function (data) {

			var sockets = Object.keys(data)
				.map(function (value, index, array) {
					return generateSocketRow(value, data[value])
							.prepend("<td>" + index + "</td>")
				})


			socketsTableBody
				.empty()
				.append(sockets)
		})

		socket.on("disconnect", function () {
			socketId.hide()
			status.html("<h2>Connection Status: <span class='text-danger'>Disconnected</span>")
		}) 

		socket.on("poke", function (id) {
			$(socketsTableBody.children())
				.each(function (idx, elem) {
					var elem = $(elem)
					
					if (elem.data("id") == id) {
						elem.addClass("active")
						pokeDisplay.show()
						pokeID.text(id)
						poke.play()

						setTimeout(function () {
							poke.stop()
							if (pokeID.text() == id) {
								pokeDisplay.hide()
							}
						}, 2500)
					}
				})
		})

		socket.on("joinedRooms", function (rooms) {
			var list = rooms.map(function (value) {
				return (
					$("<li></li>")
						.text(value)
				)
			})

			joinedRoomsList
				.empty()
				.append(list)
		})

		nameBtn.on("click", function (event) {
			event.preventDefault()

			socket.emit("name", nameInput.val())
		})

		roomBtn.on("click", function (event) {
			var room = roomInput.val()

			socket.emit("joinRoom", room)
		})


		// generatres the row for the sockets
		function generateSocketRow (socketID, socketData) {
			var row = $("<tr></tr>")
						.data("id",  socketID)

			if (id == socketID) {
				row.addClass("success")
			}

			row.append(
				$("<td></td>").text(socketID)
				)

			if (socketData) {
				var dataCols = Object.keys(socketData)
					.map(function (value, index, array) {
						var td = $("<td></td>")

						if (value == "date") {
							td.text(new Date(socketData[value]).toString())
							return td
						}

						if (socketData[value]) {
							td.text(socketData[value])
						}
						else if (value == "name") {
							td.text("No name given!")
						}
						else {
							td.text("No Value Provided!")
						}

						return td
					})

				row.append(dataCols)
			}

			if (id != socketID) {
				row.on("click", function (event) {
					var obj = {
						id: row.data("id")
					}

					socket.emit("poke", obj)
				})
			}

			return row
 		}
	})
}())
