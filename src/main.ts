import "./style.css";
import { io } from "socket.io-client";
import addButtonsListeners from "./addButtonsListeners";
import { hangeRoom } from "./comunicationFunctions";

const socket = io(":3000");

const initConnection = (): void => {
	socket.on("connect", () => {
		hangeRoom(socket, "home");
	});

	socket.on("message", (message) => {
		console.log(message);
	});
};

document.addEventListener("DOMContentLoaded", () => {
	initConnection();

	addButtonsListeners(socket);
});
