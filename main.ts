import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { Database } from './src/db';

let mainWindow: BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Start Game',
                    accelerator: 'Ctrl+P',
                    click: () => {
                        mainWindow.webContents.send('game-start');
                    }
                },
                {
                    label: 'Restart Game',
                    accelerator: 'Ctrl+M',
                    click: () => {
                        mainWindow.webContents.send('game-restart');
                    }
                },
                {
                    label: 'Stop Game',
                    accelerator: 'Ctrl+E',
                    click: () => {
                        mainWindow.webContents.send('game-stop');
                    }
                },
                {
                    label: 'Show Leaderboard',
                    accelerator: 'Ctrl+T',
                    click: () => {
                        mainWindow.webContents.send('show-leaderboard');
                    }
                },
                {
                    label: 'Quit',
                    accelerator: 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    accelerator: 'Ctrl+I',
                    click: () => {
                        dialog.showMessageBox({
                            type: 'info',
                            title: 'About',
                            message: 'Doan Anh Ngoc Pham Thi Lien',
                            detail: 'Phat trien ung dung'
                        });
                    }
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('show-info', (event) => {
    const info = {
        courseName: 'Your Course Name',
        school: 'Your School',
        department: 'Your Department',
        members: [
            { name: 'Member 1', id: 'MSSV1' },
            { name: 'Member 2', id: 'MSSV2' },
            { name: 'Member 3', id: 'MSSV3' },
            // Thêm thành viên khác nếu cần
        ],
        endDate: 'Your End Date'
    };
    event.reply('show-info-reply', info);
});

ipcMain.on('game-start', (event) => {
    event.reply('game-start-reply');
});

ipcMain.on('game-restart', (event) => {
    event.reply('game-restart-reply');
});

ipcMain.on('game-stop', (event) => {
    event.reply('game-stop-reply');
});

ipcMain.on('show-leaderboard', async (event) => {
    const leaderboardData = await Database.getInstance().getLeaderboard();
    event.reply('leaderboard-data', leaderboardData);
});
