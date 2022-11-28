const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
// Send a message to the main process




const createWindow = () => {
  const win = new BrowserWindow({
    width: 1520,
    height: 900,
    autoHideMenuBar: true,
  });

  win.loadFile('index.html');
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
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: 'A new version has been found. Restart the application to apply the updates.',
  };
});

autoUpdater.on('update-downloaded', () => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: 'Update downloaded. Restart the application to apply the updates.',
  };
});

autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application');
  console.error(message);
});



