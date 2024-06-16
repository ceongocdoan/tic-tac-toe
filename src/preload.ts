import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    startGame: () => ipcRenderer.send('game-start'),
    restartGame: () => ipcRenderer.send('game-restart'),
    showLeaderboard: () => ipcRenderer.send('show-leaderboard'),
    showInfo: () => ipcRenderer.send('show-info'),
    saveWinner: (player: string, moves: number) => ipcRenderer.send('save-winner', { player, moves }),
    onShowInfo: (callback: () => void) => ipcRenderer.on('show-info', callback),
    // Thêm dòng này để khai báo sự kiện onLeaderboardData
    onLeaderboardData: (callback: (data: any) => void) => ipcRenderer.on('leaderboard-data', (event, data) => callback(data))
});
