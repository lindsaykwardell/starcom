// tslint:disable-next-line: no-var-requires
require("dotenv").config();
import "reflect-metadata";
// import connectToDb from './config/db'
import log from "./config/log";
import server from "./server";
import socketIo from "socket.io";

const port = process.env.PORT || 5000;

log()
  // .then(() => connectToDb())
  .then(() => {
    console.info("Database connected!");
    const http = server.listen(port, () => {
      console.info(`Server listening on port ${port}`);
    });

    const io = socketIo(http);

    io.on("connection", (socket) => {
      console.log("Client connected!");
    });
  });
