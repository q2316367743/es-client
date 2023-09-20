import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import Constant from "@/global/Constant";
import MessageUtil from "@/utils/MessageUtil";
import {updateTo3ByUtools, updateTo3ByWeb} from "@/components/version-manager/updateTo3";
import useLoadingStore from "@/store/LoadingStore";
import PluginModeEnum from "@/enumeration/PluginModeEnum";

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
    let version = getItemByDefault(LocalNameEnum.KEY_VERSION, '');
    if (version == '') {
        version = oldVersion;
    }

    if (version === '') {
        setItem(LocalNameEnum.KEY_VERSION, Constant.version);
        MessageUtil.success("欢迎您使用es-client");
        updateTo3();
        return VersionStatus.NEW;
    } else if (version != Constant.version) {
        setItem(LocalNameEnum.KEY_VERSION, Constant.version);
        MessageUtil.success("欢迎您更新到" + Constant.version);
        updateTo3();
        return VersionStatus.UPDATE;
    } else {
        return VersionStatus.NONE;
    }
}

function updateTo3() {
    if (Constant.sign === 300) {
        if (Constant.mode === PluginModeEnum.UTOOLS) {
            useLoadingStore().start("链接迁移")
            updateTo3ByUtools().then(() => MessageUtil.success("迁移完成"))
                .catch(e => MessageUtil.error("迁移失败", e))
                .finally(() => useLoadingStore().close());
        } else {
            useLoadingStore().start("链接迁移")
            updateTo3ByWeb().then(() => MessageUtil.success("迁移完成"))
                .catch(e => MessageUtil.error("迁移失败", e))
                .finally(() => useLoadingStore().close());
        }
    }
}
