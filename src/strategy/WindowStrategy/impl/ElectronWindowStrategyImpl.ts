import WindowStrategy from "@/strategy/WindowStrategy/WindowStrategy";

enum IpcEventNameEnum {

    WINDOW_MAX = 'window:max',

    WINDOW_MIN = 'window:min',

    WINDOW_CLOSE = 'window:close'

}

class IpcManage {


    send(eventName: IpcEventNameEnum, args?: any) {
        // @ts-ignore
        window.require('electron').ipcRenderer.send(eventName, args);
    }

    invoke(eventName: IpcEventNameEnum, args?: any) {
        // @ts-ignore
        window.require('electron').ipcRenderer.invoke(eventName, args);
    }

}

export default class ElectronWindowStrategyImpl implements WindowStrategy {

    private readonly ipcManage: IpcManage;

    constructor() {
        this.ipcManage = new IpcManage();
    }

    close(): void {
        this.ipcManage.invoke(IpcEventNameEnum.WINDOW_CLOSE);
    }

    max(): void {
        this.ipcManage.invoke(IpcEventNameEnum.WINDOW_MAX);
    }

    min(): void {
        this.ipcManage.invoke(IpcEventNameEnum.WINDOW_MIN);
    }

    show(): { min: boolean; max: boolean; close: boolean } {
        return {close: true, max: true, min: true};
    }

}