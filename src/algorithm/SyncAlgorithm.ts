import Url from "@/entity/Url";
import {syncStrategyContext, urlService} from "@/global/BeanFactory";
import ArrayUtil from "@/utils/ArrayUtil";
import useSyncStore from "@/store/SyncSettingStore";
import Assert from "@/utils/Assert";
import TableNameEnum from "@/enumeration/TableNameEnum";
import useUrlStore from "@/store/UrlStore";
import {ElLoading} from "element-plus";
import BaseSearchHistory from "@/entity/BaseSearchHistory";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import MessageUtil from "@/utils/MessageUtil";

/**
 * url同步算法
 * @param remoteList 远程列表
 */
async function url(remoteList: Array<Url>): Promise<void> {
    // 获取策略
    let strategy = syncStrategyContext.getStrategy(useSyncStore().getSyncMode);
    Assert.notNull(strategy, "同步策略没有获取到");
    // 新增的数据
    let remoteAdd = new Array<Url>();
    let localAdd = new Array<Url>();
    let remoteUpdate = new Array<Url>();
    let localUpdate = new Array<Url>();
    // 远程list变为map
    let remoteMap = ArrayUtil.map(remoteList, 'id');
    // 获取本地链接
    let localList = await urlService.list();
    // 本地链接变为mao
    let localMap = ArrayUtil.map(localList, 'id');
    // 先遍历本地
    for (let localUrl of localList) {
        if (remoteMap.has(localUrl.id)) {
            // 远程存在此url，根据更新时间判断，保留最新的
            let remoteUrl = remoteMap.get(localUrl.id);
            if (remoteUrl!.updateTime!.getTime() > localUrl.updateTime!.getTime()) {
                // 使用远程
                remoteUpdate.push(remoteUrl!);
            } else {
                localUpdate.push(localUrl);
            }
        } else {
            // 远程没有本地有，远程新增
            remoteAdd.push(localUrl);
        }
    }
    // 再遍历远程
    for (let remoteUrl of remoteList) {
        if (localMap.has(remoteUrl.id)) {
            // 本地存在此url，已经处理过了，跳过
        } else {
            // 远程有本地没有，本地新增
            localAdd.push(remoteUrl);
        }
    }
    // 新增本地
    for (let url of localAdd) {
        await urlService.insert(url);
    }
    // 远程新增
    for (let url of remoteAdd) {
        await strategy!.insert<Url>(TableNameEnum.URL, url);
    }
    // 本地更新，只会更新内容
    for (let url of localUpdate) {
        if (url.id) {
            await urlService.updateById(url, url.id);
        }
    }
    // 远程更新，更新包括ID
    for (let url of remoteUpdate) {
        if (url.id) {
            await strategy!.update(TableNameEnum.URL, url.id, url);
        }
    }
    // 更新链接存储
    useUrlStore().reset();
}

export default async function sync(
    remoteUrlList: Array<Url>,
    remoteBaseSearchHistoryList: Array<BaseSearchHistory>,
    remoteSeniorSearchHistoryList: Array<SeniorSearchHistory>
) {
    const loading = ElLoading.service({
        lock: true,
        text: '开始同步',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        loading.setText('开始同步链接');
        await url(remoteUrlList);
    } catch (e: any) {
        MessageUtil.error('同步失败', e);
    } finally {
        loading.close();
    }
}