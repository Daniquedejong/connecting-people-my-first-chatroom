let socket = io();
let messages = document.querySelector("section ul");
let input = document.querySelector("input");
let naam = document.querySelector("#naam");
let bericht = document.querySelector("#bericht");
let form = document.querySelector("form");

// State messages
const logo = document.querySelector(".logo");

// Luister naar het submit event
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Als er iets getypt is
  if (input.value) {
    // Stuur het bericht naar de server
    socket.emit("message", {
      naam: naam.value,
      bericht: bericht.value,
    }),
      // Leeg het form field
      (bericht.value = "");
  }
});

// Luister naar berichten van de server
socket.on("message", (message) => {
  addMessage(`${message.naam}: ${message.bericht}`);
});

socket.on("whatever", (message) => {
  addMessage(message);
});

// Luister naar de historie van de chat
socket.on("history", (history) => {
  // Per bericht de naam en message laten zien
  history.forEach((message) => {
    addMessage(`${message.naam}: ${message.bericht}`);
  });
});

//
function addMessage(message) {
  const currentTime = new Date().toLocaleTimeString("nl-NL", {
    hour: "numeric",
    minute: "numeric",
  });

  const messageElement = document.createElement("li");
  const timeElement = document.createElement("span");

  messageElement.classList.add("own-message");
  timeElement.classList.add("own-time");

  messages.appendChild(Object.assign(messageElement, { textContent: message }));
  messages.appendChild(
    Object.assign(timeElement, { textContent: currentTime })
  );
  messages.scrollTop = messages.scrollHeight;
}

// // De server stuurt doorlopend pings om te kijken of de boel online is
// socket.on('ping', () => {
//   // ...
// })