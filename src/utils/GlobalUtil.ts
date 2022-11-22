import _ from 'lodash';
import { ElMessageBox } from "element-plus";

import { tipService } from '@/global/BeanFactory';

let languages = ['zh', 'en'] as Array<string>;

export function getDefaultLanguage(): string {
    let language = 'zh';
    if (localStorage.getItem('language')) {
        let local = localStorage.getItem('language')!;
        if (_.findIndex(languages, e => e === local) > -1) {
            language = local;
        }
    }
    return language;
}

/**
 * 验证请求方式方法是否可以被执行
 *
 * @param method 请求方式
 * @param link 链接
 * @returns 是否可以执行
 */
export async function validateTip(method: string, link: string): Promise<boolean> {
    let tips = await tipService.list();
    for (let tip of tips) {
        if (tip.mode === 1) {
            if (tip.link === link && (tip.method === method || tip.method === '*')) {
                return showTip();
            }
        } else if (tip.mode === 2) {
            if (link.indexOf(link) > -1 && (tip.method === method || tip.method === '*')) {
                return showTip();
            }
        }
    }
    return Promise.resolve(true);
}

async function showTip(): Promise<boolean> {
    try {
        await ElMessageBox.confirm('此操作为危险操作，是否继续？', '危险操作提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
        });
        return Promise.resolve(true);
    } catch (e) {
        return Promise.resolve(false);
    }
}