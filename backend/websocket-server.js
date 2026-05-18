const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

export function setUpServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  games = { 2: ["tic-tac-toe"] };

  names = {};
  messages = [];
  lobbies = {};

  io.on("connection", (socket) => {
    // create lobby
    socket.on("create_lobby", (lobby) => {
      lobbies[lobby.name] = {
        inGame: false,
        name: lobby.name,
        members: [{ id: socket.id, name: names[socket.id] }],
      };
      io.emit("lobbies", lobbies);
      console.log("New lobby: ", lobby.name);
    });

    // join lobby
    socket.on("join_lobby", (lobby_name) => {
      lobbies[lobby_name].members.push({
        id: socket.id,
        name: names[socket.id],
      });
      io.emit("lobbies", lobbies);
      console.log("Lobby started:", lobby_name);
    });

    // leave lobby
    socket.on("leave_lobby", (lobby_name) => {
      lobbies[lobby_name].members = lobbies[lobby_name].members.filter(
        (player) => player.id !== socket.id,
      );
      io.emit("lobbies", lobbies);
      console.log("Player left lobby:", lobby_name);
    });

    // leave lobby
    socket.on("start_lobby", (lobby_name) => {
      lobbies[lobby_name].inGame = true;
      io.emit("lobbies", lobbies);
      emitForLobby(lobby_name, "start_lobby");
      console.log("Lobby started:", lobby_name);
    });

    socket.on("name", (name) => {
      Object.keys(names).forEach((id) => {
        if (names[id] == name) {
          Object.keys(lobbies).forEach((lobby) => {
            lobbies[lobby].members.forEach((member) => {
              if (member.name == name) {
                member.id = socket.id;
              }
            });
            lobbies[lobby].gameState.players.forEach((member) => {
              if (member.name == name) {
                member.id = socket.id;
              }
            });
          });
          socket.emit("name", name);
          socket.emit("start_lobby");
          console.log("User reconnected:", socket.id, name);
          delete names[id];
          names[socket.id] = name;
          return;
        }
      });

      socket.emit("name", name);
      console.log("User connected:", socket.id, name);
      io.emit("messages", messages);
      io.emit("lobbies", lobbies);
      names[socket.id] = name;
    });

    socket.on("lobby", () => {
      socket.emit("lobby", getLobbyOfUser(socket.id));
    });

    socket.on("message", (message) => {
      messages.push({
        id: socket.id,
        name: names[socket.id],
        text: message.text,
      });
      messages = messages.slice(-10);
      io.emit("messages", messages);
    });

    socket.on("game", (action) => {
      if (action.game == "tic-tac-toe") {
        console.log("tic-tac-toe");
        ticTacToe(socket.id, action);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

function emitForLobby(lobbyName, action, data) {
  lobbies[lobbyName].members.forEach((element) => {
    io.to(element.id).emit(action, data);
  });
}

function getLobbyOfUser(userId) {
  const key = Object.keys(lobbies).find((lobby) =>
    lobbies[lobby].members.some((member) => member.id == userId),
  );
  let lobby = lobbies[key];
  if (lobby == undefined) {
    return undefined;
  }
  lobby.games = games[lobbies[key].members.length];
  return lobby;
}

function ticTacToe(player, action) {
  lobby = getLobbyOfUser(player);
  if (lobby.game != "tic-tac-toe") {
    lobby.game = "tic-tac-toe";
    lobby.gameState = {
      size: action.config.size,
      tiles: Array(action.config.size * action.config.size).fill(null),
      win: Math.min(action.config.size, 4),
      players: [...lobby.members].sort(() => Math.random() - 0.5),
      nextPlayer: 0,
      winner: null,
    };
    console.log(this.lobbies, lobby);
  } else {
    console.log("Move: ", action.move);
    console.log(lobby);
    if (
      lobby.gameState.players[lobby.gameState.nextPlayer].id == player &&
      lobby.gameState.tiles[action.move] == null
    ) {
      lobby.gameState.tiles[action.move] = lobby.gameState.nextPlayer + 1;
      lobby.gameState.nextPlayer = (lobby.gameState.nextPlayer + 1) % 2;
    } else {
      console.log("Wrong move: ", action.move);
    }
  }
  emitForLobby(lobby.name, "game", lobby);
}

module.exports = { setupWebSocket };
