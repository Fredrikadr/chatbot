import { apiKey, apiURL } from "./config.mjs"

let inputField = document.querySelector("#message-input");
let chatWindow = document.querySelector(".chat-window");
let sendButton = document.querySelector("#send-btn")


sendButton.addEventListener("click", sendMessage)

function sendMessage() {
  let message = inputField.value;

  displayMessage("You", message);

  inputField.value = "";
}

function displayMessage(sender, message) {
  let newMessage = document.createElement("div");
  newMessage.className = "message"
  chatWindow.appendChild(newMessage)
  newMessage.innerHTML = `${sender}: ${message}`
}



