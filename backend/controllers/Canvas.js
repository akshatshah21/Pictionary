class Canvas {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    broadcastDrawing(data) {
        const { socket } = this;
        console.log("roomID",socket.roomID)
        console.log("canvas-controller")
        socket.broadcast.to(socket.roomID).emit('drawing', data);
    }

    clearCanvas() {
        const { socket } = this;
        socket.broadcast.to(socket.roomID).emit('clearCanvas');
    }
}

module.exports = Canvas;