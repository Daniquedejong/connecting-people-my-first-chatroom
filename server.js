import * as path from "path";

import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const http = createServer(app);
const ioServer = new Server(http);

const port = process.env.PORT || 7000;

// Zie de historie
const historySize = 50;

let history = [];

// Serveer client-side bestanden
app.use(express.static(path.resolve("public")));

// Start de socket.io server op
ioServer.on("connection", (client) => {
  // Log de connectie naar console
  console.log(`user ${client.id} connected`);

  // Stuurt de history door
  ioServer.emit("history", history);

  // Luister naar een message van een gebruiker
  client.on("message", (message) => {
    // Log het ontvangen bericht
    console.log(`user ${client.id} sent message: ${message}`);

    // Check de maximum lengte van de historie
    while (history.length > historySize) {
      history.shift();
    }
    // Voeg het toe aan de historie
    history.push(message);

    // Verstuur het bericht naar alle clients
    ioServer.emit("message", message);
  });

  // Luister naar een disconnect van een gebruiker
  client.on("disconnect", () => {
    // Log de disconnect
    console.log(`user ${client.id} disconnected`);
  });
});

// Start een http server op het ingestelde poortnummer en log de url
http.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});
