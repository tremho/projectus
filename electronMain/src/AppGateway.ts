
import {projectDiscovery } from './Discovery'

const exportedFunctions = {
    projectDiscovery
}

/**
 * Inter-Process Communication support for Electron
 * Supports Remote Procedure calls and messaging
 */
export class AppGateway {
    private ipcMain:any;

    constructor(ipcMain:any) {
        this.ipcMain = ipcMain;
        this.attach();
    }

    public static getFunctionNames() {
        return Object.getOwnPropertyNames(exportedFunctions);
    }

    private attach() {
        Object.getOwnPropertyNames(exportedFunctions).forEach(fname => {
            const fn = exportedFunctions[fname]
            this.ipcMain.on(fname, (event, ...args)=> {
                const data = args[0]
                const id = data.id
                const callArgs = data.args || []

                let response,error;
                try {
                    response = fn(...callArgs)
                } catch(e) {
                    error = e;
                }
                event.sender.send(fname, { id, response, error })
            })
        })
    }
    public sendMessage(name:string, data:any) {
        this.ipcMain.send('message', {name, data})
    }
}