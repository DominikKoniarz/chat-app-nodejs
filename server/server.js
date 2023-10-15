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

process.env.NODE_ENV !== "production" && useLivereload(app);

app.use(cors());

app.use((req, res, next) => {
	console.log(req.method, req.path);
	next();
});

if (process.env.NODE_ENV === "production") {
	app.use("/assets", express.static(path.join("..", "dist", "assets")));

	app.get("/", (req, res) => {
		res.sendFile(path.join("..", "dist", "index.html"));
	});

	app.all("*", (req, res) => {
		res.status(404).json({ message: "Not Found" });
	});
}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	socket.broadcast.emit("new-user-connected", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("user-disconnected", socket.id);
	});

	socket.on("message", (message, room) => {
		console.log(message);
		// socket.emit("message", message);
		socket.broadcast.emit("message", message);
	});
});

server.listen(3000, undefined, undefined, () => {
	console.log("App is listening on port 3000!");
});
