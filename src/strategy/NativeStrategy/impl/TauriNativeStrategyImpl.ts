import Constant from "@/global/Constant";
import NativeStrategy from "@/strategy/NativeStrategy/NativeStrategy";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";
import { open } from "@tauri-apps/api/shell"
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';

export default class TauriNativeStrategyImpl implements NativeStrategy {

    checkUpdate(): void {
        checkUpdate().then(result => {
            if (result.shouldUpdate) {
                MessageBoxUtil.confirm(
                    `检测到新版本【${Optional.ofNullable(result.manifest)
                        .map(e => e.version)
                        .orElse('无法获取版本号')}】，当前版本【${Constant.version}】，是否立即更新`,
                    '发现新版本',
                    {
                        confirmButtonText: '更新',
                        cancelButtonText: '取消'
                    })
                    .then(() => installUpdate().then(() => MessageUtil.success('开始更新')))
                    .catch(() => MessageUtil.warning('取消更新'));
            } else {
                MessageUtil.success('当前版本已是最新版本');
            }
        })
    }

    openLink(link: string): void {
        open(link).then(() => console.log("打开链接"))
    }

}