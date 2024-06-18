import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    startGame: () => ipcRenderer.send('game-start'),
    restartGame: () => ipcRenderer.send('game-restart'),
    stopGame: () => ipcRenderer.send('game-stop'),
    showLeaderboard: () => ipcRenderer.send('show-leaderboard'),
    showInfo: () => ipcRenderer.send('show-info'),
    saveWinner: (player: string, moves: number) => ipcRenderer.send('save-winner', { player, moves }),
    onShowInfo: (callback: (info: any) => void) => ipcRenderer.on('show-info-reply', (event, info) => callback(info)),
    onLeaderboardData: (callback: (data: any) => void) => ipcRenderer.on('leaderboard-data', (event, data) => callback(data)),
    onGameStart: (callback: () => void) => ipcRenderer.on('game-start-reply', callback),
    onGameRestart: (callback: () => void) => ipcRenderer.on('game-restart-reply', callback),
    onGameStop: (callback: () => void) => ipcRenderer.on('game-stop-reply', callback)
});
