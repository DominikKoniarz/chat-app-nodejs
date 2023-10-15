const express = require("express");

const { createServer } = require("http");
const useLivereload = require("./config/lovereloadConfig");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

process.env.NODE_ENV !== "production" && useLivereload(app);

app.use((req, res, next) => {
	console.log(req.method, req.path);
	next();
});

app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js", express.static(path.join(__dirname, "public", "js")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

app.all("*", (req, res) => {
	res.status(404).json({ message: "Not Found" });
});

io.on("connection", (socket) => {
	console.log("a user connected");
});

server.listen(3000, undefined, undefined, () => {
	console.log("App is listening on port 3000!");
	console.log("http://localhost:3000");
});
