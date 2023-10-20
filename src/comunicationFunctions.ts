import { Socket } from "socket.io-client";
const roomIndicator = document.querySelector(
	"#room-indicator"
) as HTMLDivElement;

type MessageObj = {
	toRoom: string;
	message: string;
};

let roomId: string = "home";

export function sendMessage(socket: Socket, message: string) {
	const messageObj: MessageObj = {
		toRoom: roomId,
		message,
	};

	socket.emit("message", JSON.stringify(messageObj));
}

export function hangeRoom(socket: Socket, roomName: string) {
	socket.emit("change-room", roomName, () => {
		roomId = roomName;
		roomIndicator.innerText = roomName.toUpperCase();
	});
}
