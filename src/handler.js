import { /*app, protocol, BrowserWindow,*/ ipcMain, dialog} from 'electron'


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
    ipcMain.on('open-dialog', () => {
        const imgSrc = dialog.showOpenDialogSync(win, {
            title: "Select Image",
            filters: [{
                name: 'Images', extensions: ['jpg', 'png', 'gif']
            }]
        })
        if (imgSrc){
            console.log(imgSrc)
        }
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