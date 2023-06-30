import { apiKey, apiURL } from "./config.mjs"

let inputField = document.querySelector("#message-input");
let chatWindow = document.querySelector(".chat-window");
let sendButton = document.querySelector("#send-btn")

let conversation = []

const initialMessage = () => sendSystemPrompt("Introduce yourself as an AI assistant");
initialMessage();


sendButton.addEventListener("click", sendMessage)
inputField.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    sendMessage();
  } else return;
});


function sendSystemPrompt(prompt) {
  const systemPrompt = {
    role: "system",
    content: prompt
  }

  conversation.push(systemPrompt);
  fetchBotResponse();

}

function sendMessage() {
  if (!inputField.value) {
    return;
  }
  let message = {
    role: "user",
    content: inputField.value
  };

  displayMessage(message);

  inputField.value = "";

  conversation.push(message);

  fetchBotResponse();
}

function displayMessage(message) {
  let newMessage = document.createElement("div");
  newMessage.className = message.role == "user" ? "user-message message" : "bot-message message";
  chatWindow.appendChild(newMessage);
  newMessage.innerHTML = `${message.content}`;
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
  try {
    const response = await fetch(apiURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await response.json();
    const botMessage = data.choices[0].message;

    conversation.push(botMessage);

    displayMessage(botMessage);
    console.log(botMessage)
    console.log(conversation)

  } catch (error) {
    console.log(error);
    //TODO: Display an error to user
  }


 

}
