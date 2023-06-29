import { apiKey, apiURL } from "./config.mjs"

let inputField = document.querySelector("#message-input");
let chatWindow = document.querySelector(".chat-window");
let sendButton = document.querySelector("#send-btn")

let conversation = []


sendButton.addEventListener("click", sendMessage)

function sendMessage() {
  let message = {
    role: "user",
    content: inputField.value
  };

  displayMessage("You", message.content);

  inputField.value = "";

  conversation.push(message)

  fetchBotResponse();
}

function displayMessage(sender, message) {
  let newMessage = document.createElement("div");
  newMessage.className = "message"
  chatWindow.appendChild(newMessage)
  newMessage.innerHTML = `${sender}: ${message}`
}

async function fetchBotResponse() {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };

  const payload = {
    messages: conversation,
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
  const botMessage = data.choices[0].message

  conversation.push(botMessage);
  console.log(botMessage)
  console.log(conversation)

  displayMessage("Bot", botMessage.content)

}
