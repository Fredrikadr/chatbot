import { apiKey, apiURL } from "./config.mjs"

let inputField = document.querySelector("#message-input");
let chatWindow = document.querySelector(".chat-window");
let sendButton = document.querySelector("#send-btn")

let messages = []


sendButton.addEventListener("click", sendMessage)

function sendMessage() {
  let message = inputField.value;

  displayMessage("You", message);

  inputField.value = "";

  fetchBotResponse(message);
}

function displayMessage(sender, message) {
  let newMessage = document.createElement("div");
  newMessage.className = "message"
  chatWindow.appendChild(newMessage)
  newMessage.innerHTML = `${sender}: ${message}`
}

async function fetchBotResponse(message) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };

  const payload = {
    messages: [],
    model: "gpt-3.5-turbo",
    max_tokens: 100,
    temperature: 0
  };

  const response = await fetch(apiURL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  console.log(data);
  return data.choices[0].text;

}
