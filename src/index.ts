// tslint:disable-next-line: no-var-requires
require("dotenv").config();
import "reflect-metadata";
// import connectToDb from './config/db'
import log from "./config/log";
import server from "./server";
import socketIo from "socket.io";

const port = process.env.PORT || 5000;

const LOBBY = "lobby";

let connections: string[] = [];

// TODO - type the game.
// Connecting players will either receive the gamestate, or be requested to provide it
let games: any[] = [];

log()
  // .then(() => connectToDb())
  .then(() => {
    console.info("Database connected!");
    const http = server.listen(port, () => {
      console.info(`Server listening on port ${port}`);
    });

    const io = socketIo(http);

    io.on("connection", (socket) => {
      console.log("Client connected!", socket.id);

      connections = [...connections, socket.id];

      socket.join(LOBBY);

      io.to(LOBBY).emit("update-game-list", games);

      socket.on("start-game", () => {
        console.log("The game is starting");
        const id = Math.floor(Math.random() * 999999999);

        console.log(id);

        games = [...games, { id, connections: [socket.id], state: null }];

        io.to(LOBBY).emit("update-game-list", games);
        
        socket.join(id.toString());

        socket.emit("enter-game", id);
      });

      socket.on("enter-game", (id: number) => {
        console.log("Someone is joining a game", id);
        socket.join(id.toString());

        games = games.map((game) =>
          game.id === id
            ? {
                ...game,
                connections: [...new Set([...game.connections, socket.id])],
              }
            : game
        );

        io.to(LOBBY).emit("update-game-list", games);

        socket.emit("enter-game", id);
      });

      socket.on("entered", (id: number) => {
        const game = games.find((g) => g.id === id);
        socket.emit("sync", game?.state);
      });

      socket.on("sync", ({ id, state }: { id: number; state: any }) => {
        if (id) {
          games = games.map((game) =>
            game.id === id ? { ...game, state } : game
          );
          io.to(id.toString()).emit("sync", state);
        }
      });

      socket.on("disconnect", () => {
        connections = connections.filter((conn) => conn === socket.id);

        games = games
          .map((game) => ({
            ...game,
            connections: game.connections.filter(
              (conn: string) => conn !== socket.id
            ),
          }))
          .filter((game) => game.connections.length > 0);
      });
    });
  });
