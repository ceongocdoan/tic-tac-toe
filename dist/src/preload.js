"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    startGame: function () { return electron_1.ipcRenderer.send('game-start'); },
    restartGame: function () { return electron_1.ipcRenderer.send('game-restart'); },
    stopGame: function () { return electron_1.ipcRenderer.send('game-stop'); },
    showLeaderboard: function () { return electron_1.ipcRenderer.send('show-leaderboard'); },
    showInfo: function () { return electron_1.ipcRenderer.send('show-info'); },
    saveWinner: function (player, moves) { return electron_1.ipcRenderer.send('save-winner', { player: player, moves: moves }); },
    onShowInfo: function (callback) { return electron_1.ipcRenderer.on('show-info-reply', function (event, info) { return callback(info); }); },
    onLeaderboardData: function (callback) { return electron_1.ipcRenderer.on('leaderboard-data', function (event, data) { return callback(data); }); },
    onGameStart: function (callback) { return electron_1.ipcRenderer.on('game-start-reply', callback); },
    onGameRestart: function (callback) { return electron_1.ipcRenderer.on('game-restart-reply', callback); },
    onGameStop: function (callback) { return electron_1.ipcRenderer.on('game-stop-reply', callback); }
});
