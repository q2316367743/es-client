import Constant from "@/global/Constant";

export default class VersionManage {

    private readonly currentVersion = Constant.version;
    private storageVersion: string;

    private readonly KEY = 'es-client.version'

    constructor() {
        this.storageVersion = localStorage.getItem(this.KEY) || '';
    }

    public checkUpdate(): boolean {
        return this.currentVersion === this.storageVersion;
    }

    public execUpdate(): void {
        localStorage.setItem(this.KEY, this.currentVersion);
        this.storageVersion = this.currentVersion + '';
    }

}