import { API_KEY, API_URL } from "./config.mjs"

const apiUrl = process.env.API_URL || API_URL;
const apiKey = process.env.API_KEY || API_KEY;

let inputField = document.querySelector("#message-input");
let chatWindow = document.querySelector(".chat-window");
let sendButton = document.querySelector("#send-btn");

// Array to store conversation objects
let conversation = [];

// Sends system prompt to the gpt-model and displays an initial message to the user.
const initialMessage = () => sendSystemPrompt("Introduce yourself as an AI assistant");
initialMessage();


sendButton.addEventListener("click", sendMessage)
inputField.addEventListener("keydown", (e) => {
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault();
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

// Takes user input to display message in chat and calls for bot response
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

  //Adds linebreaks in HTML
  const messageContent = message.content.replace(/\n/g, '<br>');

  newMessage.innerHTML = `${messageContent}`;
  chatWindow.appendChild(newMessage);

  //Scrolls down the chatwindow to latest message
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Fetches response from API based on user message
async function fetchBotResponse() {
  //Show typing animation
  const loadingSpinner = document.querySelector(".loader");
  loadingSpinner.style.display = "block";

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };

  const payload = {
    messages: conversation,
    model: "gpt-3.5-turbo",
    max_tokens: 300,
    temperature: 0
  };
  try {
    const response = await fetch(apiUrl, {
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

  } catch (error) {
    console.log(error);
    const errorContainer = document.querySelector(".error-message");
    errorContainer.innerHTML = `There was an error getting a response. Please try again.`;


  } finally {
    //Hide typing animation
    loadingSpinner.style.display = "none";
  }


 

}
