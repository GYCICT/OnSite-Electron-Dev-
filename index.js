const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
// Send a message to the main process



const createWindow = () => {
  const win = new BrowserWindow({
    width: 1520,
    height: 900,
    autoHideMenuBar: true,
    fullscreen: true,
  });

  win.loadFile('index.html');

  let updateVersion = `
  const version = 'v${app.getVersion()}';
  localStorage.setItem('version', version);
  `;

  win.webContents.executeJavaScript(updateVersion);


  setInterval(() => {
    autoUpdater.checkForUpdates();
    win.webContents.executeJavaScript('console.log("Checking for updates...")');
    
  }
  , 60000);

};



app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on('update-available', () => {
// show a dialog that lasts 3 seconds
  setTimeout(() => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update available',
      message: 'A new update is available. It will be downloaded in the background',
    });
  }, 3000);
});

autoUpdater.on('update-downloaded', () => {
    setImmediate(() => autoUpdater.quitAndInstall(isSilent = true, isForceRunAfter = true));
});


autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application');
  console.error(message);
});





