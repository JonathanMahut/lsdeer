const { remote, ipcRenderer } = window.require('electron');
const mainWindow = remote.getCurrentWindow();

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+,',
        click() {
          ipcRenderer.send('open-settings');
        },
      },
      {
        label: 'Quit',
        role: 'quit',
        accelerator: 'CmdOrCtrl+Q',
        click() {
          console.log('exit');
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll',
        click(e) {
          ipcRenderer.send('select-all');
        },
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click(e) {
          ipcRenderer.send('copy-files');
        },
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click(e) {
          ipcRenderer.send('paste-files');
        },
      },
      {
        label: 'Delete',
        accelerator: 'delete',
        click(e) {
          ipcRenderer.send('delete-selected');
        },
      },
      {
        label: 'XDelete',
        accelerator: 'shift+delete',
        click(e) {
          ipcRenderer.send('x-delete-selected');
        },
      },
      {
        label: 'Add to favorites',
        accelerator: 'CmdOrCtrl+B',
        click() {
          console.log('Add file to favorites');

          ipcRenderer.send('add-files-to-favorites');
        },
      },
    ],
  },
  {
    label: 'Tabs',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+T',
        click() {
          ipcRenderer.send('new-tab');
        },
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        click() {
          // TODO: add ipc main event and emit it here
          // in App component listen to response and close current tab
          ipcRenderer.send('close-current-tab');
        },
      },
      {
        label: 'Add to favorites',
        accelerator: 'CmdOrCtrl+G',
        click() {
          ipcRenderer.send('add-to-favorites');
        },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Find',
        accelerator: 'CmdOrCtrl+F',
        click(e) {
          ipcRenderer.send('find');
        },
      },
      {
        label: 'Refresh Page',
        accelerator: 'CmdOrCtrl+R',
        click() {
          mainWindow.reload();
        },
      },
      {
        label: 'Open DevTools',
        accelerator: 'CmdOrCtrl+`',
        click(e) {
          mainWindow.webContents.openDevTools();
        },
      },
    ],
  },
];

if (remote.process.platform === 'darwin') {
  const applicationName = 'Lsdeer';
  template.unshift({
    label: applicationName,
    submenu: [
      {
        label: `About ${applicationName}`,
      },
      {
        label: `Quit ${applicationName}`,
        role: 'quit',
      },
    ],
  });
}

export default template;