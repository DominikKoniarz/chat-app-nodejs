import { Socket } from "socket.io-client";
import { hangeRoom, sendMessage } from "./comunicationFunctions";

const formInput = document.querySelector("#message-input") as HTMLInputElement;
const messageForm = document.querySelector("#message-form") as HTMLFormElement;
const roomsButtons = document.querySelector(".rooms-buttons") as HTMLDivElement;

function addButtonsListeners(socket: Socket) {
	roomsButtons.addEventListener("click", (event: Event) => {
		const target = event.target as EventTarget;
		if (!(target instanceof HTMLButtonElement)) return;
		if (!target.classList.contains("room-button")) return;

		const roomName = target.dataset["room"];
		if (!roomName) return;

		hangeRoom(socket, roomName);
	});

	messageForm.addEventListener("submit", (event: SubmitEvent) => {
		event.preventDefault();
		const inputValue: string = formInput.value;

		if (inputValue.length === 0) return;

		sendMessage(socket, inputValue);
		formInput.value = "";
	});
}

export default addButtonsListeners;
