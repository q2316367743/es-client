import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import Constant from "@/global/Constant";
import MessageUtil from "@/utils/MessageUtil";

export enum VersionStatus {
    // 新用户
    NEW = 1,
    // 版本更新
    UPDATE = 2,
    // 最新版本
    NONE = 3
}

const OLD_KEY: string = 'es-client.version';

export function versionManager(): VersionStatus {
    const oldVersion = getItemByDefault(OLD_KEY, '');
    const version = getItemByDefault(LocalNameEnum.KEY_VERSION, '');
    if (version === '') {
        setItem(LocalNameEnum.KEY_VERSION, Constant.version);
        MessageUtil.success("欢迎您使用es-client")
        return VersionStatus.NEW;
    } else if (version != Constant.version) {
        setItem(LocalNameEnum.KEY_VERSION, Constant.version);
        MessageUtil.success("欢迎您更新到" + Constant.version);
        return VersionStatus.UPDATE;
    } else {
        return VersionStatus.NONE;
    }
}
