// tauri
import { open } from "@tauri-apps/api/shell"
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';
import { writeText } from '@tauri-apps/api/clipboard';

// 工具类
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";

import Constant from "@/global/Constant";
import NativeStrategy from "@/strategy/NativeStrategy/NativeStrategy";
import DownloadType from "../DownloadType";
import BrowserUtil from "@/utils/BrowserUtil";

export default class TauriNativeStrategyImpl implements NativeStrategy {

    copy(value: string): void {
        writeText(value).then(() => MessageUtil.success('成功复制到剪切板'));
    }

    download(value: string, name: string, type: DownloadType): void {
        // 打开保存对话框
        // save({
        //     title: '保存文件',
        //     defaultPath: name,
        //     filters: [{
        //         name: `${type}文件`,
        //         extensions: [type]
        //     }, {
        //         name: '任意文件',
        //         extensions: ['*']
        //     }]
        // }).then(result => {
        //     if (result) {
        //         writeTextFile(result, value)
        //             .then(() => MessageUtil.success('下载完成'));
        //     }
        // })
        BrowserUtil.download(value, name, type);
        MessageUtil.success('下载完成');
    }

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