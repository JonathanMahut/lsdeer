const electron = require('electron');
const { ipcMain } = electron;
const path = require('path');
const { ncp } = require('ncp');
ncp.limit = 16;

const ProgressBar = require('electron-progressbar');

const pasteUnderNewName = require('../helpersMain/pasteUnderNewName');
const deleteFile = require('../helpersMain/deleteFile');
const getSourceDirFromArr = require('../helpersMain/getSourceDirFromArr');
const listDirectory = require('../helpersMain/listDirectory');

let copiedFiles = [];
let filesWereCut = false;

// Allows to copy/cut/paste files/folders
module.exports = (mainWindow) => {
  ipcMain.on('copy-files', (event, isCut = false) => {
    mainWindow.webContents.send('copy-to-clipboard', { isCut });
  });

  ipcMain.on('paste-files', (event) => {
    mainWindow.webContents.send('paste-from-clipboard');
  });

  ipcMain.on('copied-file', (event, dirPath, namesArray, isCut) => {
    console.log("'copied-file'", dirPath, namesArray, isCut);

    copiedFiles = [];
    filesWereCut = isCut;

    namesArray.map((name) => copiedFiles.push(dirPath + '/' + name));
    if (isCut) {
      console.log('Cut Files ', copiedFiles);
    } else {
      console.log('Copied Files ', copiedFiles);
    }
  });

  ipcMain.on('pasted-file', (event, dirPath, deleteSourceFiles = false) => {
    // TODO: send response to renderer with array of pasted filenames and select these files

    if (copiedFiles.length > 0) {
      const progressBar = new ProgressBar({
        indeterminate: false,
        text: 'Preparing data...',
        detail: 'Copying data please wait...',
        maxValue: copiedFiles.length,
        browserWindow: {
          text: 'Preparing data...',
          detail: 'Wait...',
          webPreferences: {
            nodeIntegration: true,
          },
        },
        webPreferences: {
          nodeIntegration: true,
        },
      });

      progressBar
        .on('completed', function () {
          console.info(`completed...`);

          progressBar.detail = 'Files were copied';
        })
        .on('aborted', function (value) {
          console.info(`aborted... ${value}`);
        })
        .on('progress', function (value) {
          progressBar.detail = `Value ${value} out of ${
            progressBar.getOptions().maxValue
          }...`;
        });

      console.log(`Files ${copiedFiles} pasted to ${dirPath}`);
      let command;
      const command_unix = `ls "${dirPath}" -p --hide=*.sys --hide="System Volume Information" --group-directories-first`;
      const command_win = `chcp 65001 | dir "${path.win32.normalize(
        dirPath
      )}" /o`;

      process.platform === 'win32'
        ? (command = command_win)
        : (command = command_unix);

      const copiedFilesNames = copiedFiles.map((item) => {
        const itemArr = item.split('/');
        return itemArr[itemArr.length - 1];
      });
      console.log('copiedFilesNames', copiedFilesNames);

      listDirectory(dirPath, (dirArray) => {
        console.log('copyPaste: dirArray', dirArray);
        console.log('copyPaste: dirPath', dirPath);
        const namesArray = dirArray.map((itm) => itm.name);
        console.log('namesArray', namesArray);

        copiedFilesNames.map((item, idx) => {
          if (namesArray.includes(item)) {
            console.log(`File ${item} already exists in ${dirPath}`);
            pasteUnderNewName(copiedFiles[idx], path.normalize(dirPath), () => {
              progressBar.value += 1;
              mainWindow.webContents.send('edit-action-complete', {
                dirPath,
              });

              if (filesWereCut || deleteSourceFiles) {
                // Delete source file here
                const sourceDirPath = getSourceDirFromArr(copiedFiles);
                deleteFile(sourceDirPath + item);
                mainWindow.webContents.send('edit-action-complete', {
                  sourceDirPath,
                });
              }
            });
          } else {
            console.log(`File ${item} will be first in ${dirPath}`);

            ncp(
              path.normalize(copiedFiles[idx]),
              path.normalize(`${dirPath}/${item}`),
              function (err) {
                if (err) {
                  return console.error(err);
                }
                progressBar.value += 1;
                if (filesWereCut || deleteSourceFiles) {
                  // Delete source file here
                  const sourceDirPath = getSourceDirFromArr(copiedFiles);

                  deleteFile(sourceDirPath + item);
                  mainWindow.webContents.send('edit-action-complete', {
                    sourceDirPath,
                  });
                }
              }
            );
          }
        });
      });
    }
  });
};
