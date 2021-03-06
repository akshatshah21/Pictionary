const leven = require("leven");
const GraphemeSplitter = require("grapheme-splitter");
const { get3Words, getScore, wait, getHints } = require("./helpers");

const splitter = new GraphemeSplitter();
class Game {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  chosenWord(playerID) {
    const { io } = this;
    return new Promise((resolve, reject) => {
      function rejection(err) {
        reject(err);
      }
      const socket = io.of("/").sockets.get(playerID);
      socket.on("chooseWord", ({ word }) => {
        socket.to(socket.roomID).emit("hideWord", {
          word: splitter
            .splitGraphemes(word)
            .map((char) => (char !== " " ? "_" : char))
            .join(""),
        });
        socket.removeListener("disconnect", rejection);
        resolve(word);
      });
      socket.once("disconnect", rejection);
    });
  }

  resetGuessedFlag(players) {
    const { io } = this;
    players.forEach((playerID) => {
      const player = io.of("/").sockets.get(playerID);
      if (player) player.hasGuessed = false;
    });
  }

  async startGame() {
    const { io, socket } = this;
    const { rounds } = games[socket.roomID];
    const players = Array.from(await io.in(socket.roomID).allSockets());
    io.in(socket.roomID).emit("startGame");
    // socket.to(socket.roomID).emit('startGame');
    for (let j = 0; j < rounds; j++) {
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < players.length; i++) {
        await this.giveTurnTo(players, i);
      }
    }
    io.in(socket.roomID).emit("endGame", { stats: games[socket.roomID] });
    // TODO Memory leak! Delete games after some timeout
    // If game is deleted here, users can't "Play again"
    // delete games[socket.roomID];
  }

  async giveTurnTo(players, i) {
    const { io, socket } = this;
    try {
      const { roomID } = socket;
      const { time } = games[roomID];
      const player = players[i];
      const prevPlayer = players[(i - 1 + players.length) % players.length];
      const drawer = io.of("/").sockets.get(player);
      if (!drawer || !games[roomID]) return;
      this.resetGuessedFlag(players);
      games[roomID].totalGuesses = 0;
      games[roomID].currentWord = "";
      games[roomID].drawer = player;
      io.to(prevPlayer).emit("disableCanvas");
      io.in(roomID).emit("choosing", { name: drawer.player.name });
      io.to(player).emit("chooseWord", get3Words(roomID));
      const word = await this.chosenWord(player);
      games[roomID].currentWord = word;
      io.to(roomID).emit("clearCanvas");
      drawer.to(roomID).emit("hints", getHints(word, roomID));
      drawer.emit("hints", [{ hint: word, displayTime: time / 1000 - 1 }]);
      games[roomID].startTime = Date.now() / 1000;
      io.in(roomID).emit("startTimer", { time });
      if (await wait(roomID, drawer, time))
        io.in(roomID).emit("lastWord", { word });
    } catch (error) {
      console.log(error);
    }
  }

  onMessage(data) {
    const { io, socket } = this;
    const guess = data.message.toLowerCase().trim();
    if (guess === "") return;
    const currentWord = games[socket.roomID].currentWord.toLowerCase();
    const distance = leven(guess, currentWord);
    if (distance === 0 && currentWord !== "") {
      socket.emit("message", {
        content: guess,
        name: socket.player.name,
        timestamp: Date.now(),
        type: "correct",
      });
      if (games[socket.roomID].drawer !== socket.id && !socket.hasGuessed) {
        const drawer = io.of("/").sockets.get(games[socket.roomID].drawer);
        const { startTime } = games[socket.roomID];
        const roundTime = games[socket.roomID].time;
        const roomSize = io.sockets.adapter.rooms.get(socket.roomID).size;
        socket.emit("correctGuess", {
          timestamp: Date.now(),
          content: "You guessed it right!",
          type: "correct",
          id: socket.id,
        });
        socket.to(socket.roomID).emit("correctGuess", {
          timestamp: Date.now(),
          type: "correct",
          content: `${socket.player.name} has guessed the word!`,
          id: socket.id,
        });
        games[socket.roomID].totalGuesses++;
        games[socket.roomID][socket.id].score += getScore(startTime, roundTime);
        games[socket.roomID][drawer.id].score += BONUS;
        io.in(socket.roomID).emit("updateScore", {
          playerId: socket.id,
          playerScore: games[socket.roomID][socket.id].score,
          drawerId: drawer.id,
          drawerScore: games[socket.roomID][drawer.id].score,
        });
        if (games[socket.roomID].totalGuesses === roomSize - 1) {
          round.emit("everybodyGuessed", { roomID: socket.roomID });
        }
      }
      socket.hasGuessed = true;
    } else if (distance < 3 && currentWord !== "") {
      io.in(socket.roomID).emit("message", {
        content: guess,
        name: socket.player.name,
        timestamp: Date.now(),
        type: "regular",
      });
      if (games[socket.roomID].drawer !== socket.id && !socket.hasGuessed)
        socket.emit("closeGuess", {
          content: "That was very close!",
          timestamp: Date.now(),
          type: "close",
        });
    } else {
      io.in(socket.roomID).emit("message", {
        content: guess,
        name: socket.player.name,
        timestamp: Date.now(),
        type: "regular",
      });
    }
  }

  async getPlayers() {
    const { io, socket } = this;
    const players = Array.from(await io.in(socket.roomID).allSockets());
    io.in(socket.roomID).emit(
      "getPlayers",
      players.reduce((acc, id) => {
        const { player } = io.of("/").sockets.get(id);
        acc.push(player);
        return acc;
      }, [])
    );
  }
}

module.exports = Game;
