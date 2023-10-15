import "./style.css";
import { io } from "socket.io-client";

const usersButtons = document.querySelector("#users-buttons") as HTMLDivElement;

const socket = io("http://localhost:3000");

type User = {
	userId: string;
};

const connectedUsers: User[] = [];

const renderUserRoomButton = (container: HTMLDivElement, id: string): void => {
	const button: HTMLButtonElement = document.createElement("button");
	button.setAttribute("type", "button");
	button.setAttribute("class", "user-button");
	button.setAttribute("id", id);
	button.textContent = id;

	container.append(button);
};

const initConnection = (): void => {
	socket.on("new-user-connected", (message) => {
		const newUser: User = {
			userId: message,
		};

		connectedUsers.push(newUser);
		usersButtons.innerHTML = "";
		connectedUsers.forEach((user) => {
			renderUserRoomButton(usersButtons, user.userId);
		});
	});

	socket.on("user-disconnected", (message) => {
		const disconnectedUserId = connectedUsers.findIndex(
			(user: User) => user.userId === message
		);

		if (disconnectedUserId === -1) return;

		connectedUsers.splice(disconnectedUserId, 1);
		usersButtons.innerHTML = "";
		connectedUsers.forEach((user) => {
			renderUserRoomButton(usersButtons, user.userId);
		});
	});
};

document.addEventListener("DOMContentLoaded", () => {
	initConnection();

	usersButtons.addEventListener("click", (event: Event) => {
		const target = event.target;
		console.log(target);
	});
});
