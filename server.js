const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let gameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.emit('gameState', gameState);

  socket.on('makeMove', (index) => {
    if (gameState.board[index] === null) {
      gameState.board[index] = gameState.currentPlayer;
      gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
      io.emit('gameState', gameState);
    }
  });

  socket.on('resetGame', () => {
    gameState = {
      board: Array(9).fill(null),
      currentPlayer: 'X',
    };
    io.emit('gameState', gameState);
  });
});

server.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});