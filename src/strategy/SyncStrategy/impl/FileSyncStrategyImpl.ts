import SyncStrategy from "@/strategy/SyncStrategy/SyncStrategy";
import {ElLoading} from "element-plus";
import {baseSearchHistoryService, seniorSearchHistoryService, urlService} from "@/global/BeanFactory";
import BrowserUtil from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/MessageUtil";
import Url from "@/entity/Url";
import BaseSearchHistory from "@/entity/BaseSearchHistory";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";

export default class FileSyncStrategyImpl implements SyncStrategy {

    sync(remoteList?: {
        remoteUrlList: Array<Url>,
        remoteBaseSearchHistoryList: Array<BaseSearchHistory>,
        remoteSeniorSearchHistoryList: Array<SeniorSearchHistory>
    }): Promise<void> {
        return Promise.resolve(undefined);
    }

    async backup(): Promise<void> {
        const loading = ElLoading.service({
            lock: true,
            text: '开始准备数据',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            loading.setText('获取链接数据')
            let url = await urlService.list();
            loading.setText('获取基础搜索历史');
            let baseSearchHistory = await baseSearchHistoryService.list();
            loading.setText('获取高级搜索历史');
            let seniorSearchHistory = await seniorSearchHistoryService.list();
            loading.setText('开始下载');
            BrowserUtil.download(JSON.stringify({
                url, baseSearchHistory, seniorSearchHistory
            }, null, 4), `数据备份下载-${new Date().getTime()}.json`, 'application/json');
        } catch (e: any) {
            MessageUtil.error('下载失败', e);
        } finally {
            loading.close();
        }
        return Promise.resolve();
    }

}