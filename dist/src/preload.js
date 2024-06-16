"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    startGame: function () { return electron_1.ipcRenderer.send('game-start'); },
    restartGame: function () { return electron_1.ipcRenderer.send('game-restart'); },
    showLeaderboard: function () { return electron_1.ipcRenderer.send('show-leaderboard'); },
    showInfo: function () { return electron_1.ipcRenderer.send('show-info'); },
    saveWinner: function (player, moves) { return electron_1.ipcRenderer.send('save-winner', { player: player, moves: moves }); },
    onShowInfo: function (callback) { return electron_1.ipcRenderer.on('show-info', callback); },
    // Thêm dòng này để khai báo sự kiện onLeaderboardData
    onLeaderboardData: function (callback) { return electron_1.ipcRenderer.on('leaderboard-data', function (event, data) { return callback(data); }); }
});
