const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 6);

class Room {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    createPrivateRoom(player) {
        const { socket } = this;
        const id = nanoid();
        games[id] = {
            rounds: 5,
            time: 60 * 1000,
            customWords: [],
            language: 'English',
        };
        games[id][socket.id] = {};
        games[id][socket.id].score = 0;
        games[id][socket.id].name = player.name;
        games[id][socket.id].avatar = player.avatar;
        socket.player = player;
        socket.roomID = id;
        socket.join(id);
        socket.emit('newPrivateRoom', { gameID: id });
    }

    async joinRoom(data) {
        const { io, socket } = this;
        const roomID = data.id;
        const players = Array.from(await io.in(roomID).allSockets());
        games[roomID][socket.id] = {};
        games[roomID][socket.id].score = 0;
        games[roomID][socket.id].name = data.player.name;
        games[roomID][socket.id].avatar = data.player.avatar;
        socket.player = data.player;
        socket.join(roomID);
        socket.roomID = roomID;
        socket.to(roomID).emit('joinRoom', data.player);
        socket.emit("settingsUpdate", {
            time: games[roomID].time,
            rounds: games[roomID].rounds,
            probability: games[roomID].probability,
            language: games[roomID].language,
        })
        const otherPlayers = players.reduce((acc, id) => {
            if (socket.id !== id) {
                const { player } = io.of('/').sockets.get(id);
                acc.push({id, ...player});
            }
            return acc;
        }, []);
        socket.emit('otherPlayers', otherPlayers);
    }

    updateSettings(data) {
        const { socket } = this;
        const { customWords, ...rest } = data;
        games[socket.roomID].time = Number(data.time) * 1000;
        games[socket.roomID].rounds = Number(data.rounds);
        games[socket.roomID].probability = Number(data.probability);
        games[socket.roomID].customWords = customWords;
        games[socket.roomID].language = data.language;
        socket.to(socket.roomID).emit('settingsUpdate', rest);
    }
}

module.exports = Room;