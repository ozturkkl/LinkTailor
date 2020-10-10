import { /*app, protocol, BrowserWindow,*/ ipcMain, dialog } from 'electron'

import imageBufferFromUrl from './js/img/imgBufferFromUrl'
import saveLinkImageToFile from './js/img/saveLinkImageToFile'

import DIR from "./js/directories"
import path from "path"

export default function handler(win) {
    ipcMain.on('close-app', () => {
        win.close()
    })
    ipcMain.on('maximize-app', () => {
        if (win.isMaximized())
            win.unmaximize()
        else
            win.maximize()
    })
    ipcMain.on('minimize-app', () => {
        win.minimize()
    })

    // IMAGE HANDLING FOR THE LINKS
    ipcMain.on('open-image-dialog', (event) => {
        const imgSrc = dialog.showOpenDialogSync(win, {
            title: "Select Image",
            filters: [{
                extensions: ['jpg', 'png', 'gif']
            }]
        })
        if (imgSrc && imgSrc[0]) {
            const imgBuffer = imageBufferFromUrl(imgSrc[0]);
            event.returnValue = { buffer: imgBuffer, src: path.basename(imgSrc[0]) }
        }
        else {
            event.returnValue = null
        }
    })
    ipcMain.on('get-image-buffer', (event, args) => {
        let imgBuffer = null
        let imgUrl = null

        if (args.id === undefined || args.url === undefined) {                                  //  ADD LINK FOR THE FIRST TIME
            imgBuffer = imageBufferFromUrl(DIR.DEFAULT_ICON);
            imgUrl = DIR.DEFAULT_ICON
        }
        else {                                                                                  //  EDIT LINK THAT HAS ICON
            imgUrl = path.join(DIR.LINK_ICONS, args.id.toString(), args.url)
            imgBuffer = imageBufferFromUrl(imgUrl);
        }
        if (!imgBuffer) {                                                                       //  ICON NOT FOUND --> ERROR
            console.log("FAILED TO LOAD THE IMAGE SPECIFIED, FALLING BACK TO DEFAULT ICON!")
            imgBuffer = imageBufferFromUrl(DIR.DEFAULT_ICON);
            imgUrl = DIR.DEFAULT_ICON
        }

        event.returnValue = { buffer: imgBuffer, src: path.basename(imgUrl) }
    })
    ipcMain.on('save-link-image-to-file', (event, args) => {
        saveLinkImageToFile(args.buffer, args.label, args.id)
    })

    win.on('blur', () => {
        win.webContents.send('app-state-changed', 'blur')
    })
    win.on('focus', () => {
        win.webContents.send('app-state-changed', 'focus')
    })
    win.on('maximize', () => {
        win.webContents.send('app-state-changed', 'maximize')
    })
    win.on('unmaximize', () => {
        win.webContents.send('app-state-changed', 'unmaximize')
    })
    win.on('minimize', () => {
        win.webContents.send('app-state-changed', 'minimize')
    })
    win.on('restore', () => {
        win.webContents.send('app-state-changed', 'restore')
    })
}