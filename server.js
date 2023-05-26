import * as path from "path";

import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const http = createServer(app);
const ioServer = new Server(http);
const port = process.env.PORT || 4242;

app.use(express.static(path.resolve("public")));

ioServer.on("connection", (client) => {
  console.log(`user ${client.id} connected`);

  client.on("message", (message) => {
    ioServer.emit("message", message);
  });
});

http.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});