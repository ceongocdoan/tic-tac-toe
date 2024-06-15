import { app, BrowserWindow, ipcMain } from 'electron';
import { Database } from './db';
import * as path from 'path'; 
let mainWindow: BrowserWindow;
import { MenuItemConstructorOptions } from 'electron'; // Đảm bảo bạn import đúng kiểu dữ liệu MenuItemConstructorOptions

// Cập nhật kiểu dữ liệu của đối số phù hợp
const template: MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            { label: 'Open', accelerator: 'CmdOrCtrl+O', click: () => console.log('Open clicked!') },
            { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => console.log('Save clicked!') },
            // Các mục submenu khác nếu có
        ]
    },
    // Các mục menu khác nếu có
];

// Sử dụng template trong mã của bạn




function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('src/index.html');

  // Menu shortcuts
  const { Menu } = require('electron');
  // 
  
  const menuTemplate: MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            { label: 'New', accelerator: 'CmdOrCtrl+N', click: () => { /* your logic here */ } },
            { label: 'Open', accelerator: 'CmdOrCtrl+O', click: () => { /* your logic here */ } },
            { type: 'separator' },
            { label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => { /* your logic here */ } }
        ]
    },
    // Add more menu items as needed
];

// Create the menu
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

  ipcMain.on('save-winner', async (event, { player, moves }) => {
    const db = Database.getInstance();
    await db.saveWinner(player, moves);
  });

  ipcMain.on('get-leaderboard', async (event) => {
    const db = Database.getInstance();
    const data = await db.getLeaderboard();
    event.reply('leaderboard-data', data);
  });
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
