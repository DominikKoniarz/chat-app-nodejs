import express from "express";

import { createServer } from "http";
import useLivereload from "./config/livereloadConfig.js";
import path from "path";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
	},
});

const allowedRooms = ["home", "games", "school"];

process.env.NODE_ENV !== "production" && useLivereload(app);

app.use(cors());

app.use((req, res, next) => {
	console.log(req.method, req.path);
	next();
});

if (process.env.NODE_ENV === "production") {
	app.use(
		"/assets",
		express.static(path.join(process.cwd(), "dist", "assets"))
	);

	app.get("/", (req, res) => {
		res.sendFile(path.join(process.cwd(), "dist", "index.html"));
	});

	app.all("*", (req, res) => {
		res.status(404).json({ message: "Not Found" });
	});
}

io.on("connection", (socket) => {
	socket.on("change-room", (room, cb) => {
		if (!allowedRooms.includes(room)) return;
		const currentRoomsIterator = socket.adapter.rooms?.keys() || [].keys();

		socket.join(room);
		for (const item of currentRoomsIterator) {
			if (item !== room && item != socket.id) {
				socket.leave(item);
			}
		}

		cb(room);
	});

	socket.on("message", (obj) => {
		const { toRoom, message } = JSON.parse(obj);

		io.to(toRoom).emit("message", message);
	});
});

app.use((error, req, res, next) => {
	console.log(error.stack);
	res.json({ message: "Server Error!" });
});

server.listen(3000, undefined, undefined, () => {
	console.log("App is listening on port 3000!");
});
