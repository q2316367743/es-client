import Dexie from 'dexie';
import Url from '@/entity/Url';
import BrowserUtil from "@/utils/BrowserUtil";
import {usePageJumpEvent} from "@/global/BeanFactory";
import PageNameEnum from "@/enumeration/PageNameEnum";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default class DexieInstance extends Dexie {

    constructor() {
        super('es-client');
        this.version(5).stores({
            url: '++id, &name, &value, sequence',
            baseSearchHistory: '++id, urlId, &name',
            seniorSearchHistory: '++id, urlId, &name'
        }).upgrade(trans => {
            console.log(trans);
            // 4更新到5
            usePageJumpEvent.emit(PageNameEnum.SETTING);
            emitter.emit(MessageEventEnum.PAGE_SETTING_ACTIVE, 'url')
            trans.table('url').toArray().then(list => {
                MessageBoxUtil.alert(`版本升级，历史url数据：${JSON.stringify(list)}，请注意数据丢失。`, {
                    confirmButtonText: '复制到剪切板'
                }).then(() => {
                    BrowserUtil.copy(JSON.stringify(list, null, 4));
                }).catch(() => {});
                // 处理url
                // 删除全部
                list.forEach(item => {
                    trans.table('url').delete(item['id']);
                });
                // 查询新的
                list.forEach(item => {
                    trans.table('url').add({
                        name: item.name,
                        value: item.value,
                        sequence: item.sequence,
                        createTime: item['create_time'],
                        updateTime: item['update_time'],
                        isAuth: item['is_auth'],
                        authUser: item['authUser'],
                        authPassword: item['auth_password']
                    } as Url)
                })
            });
            // @ts-ignore
            console.log(trans, trans.idbtrans.db);
            // 删除旧的表 - tip
            // @ts-ignore
            (trans.idbtrans.db as IDBDatabase).deleteObjectStore('tip');
            // 删除旧的表 - chart
                // @ts-ignore
            (trans.idbtrans.db as IDBDatabase).deleteObjectStore('chart');
        })
    }

}