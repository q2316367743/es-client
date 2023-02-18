import ExportConfig from "@/page/BaseSearch/domain/ExportConfig";
import {BaseSearchItemBody} from "@/page/BaseSearch/domain/BaseSearchItem";
import BrowserUtil from "@/utils/BrowserUtil";
import QueryConditionBuild from "@/page/BaseSearch/component/QueryConditionBuild";
import DocumentApi from "@/api/DocumentApi";
import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";

export default async function exportBuild(
    config: ExportConfig, body: BaseSearchItemBody
) {
    let content = "";
    if (config.count === 1) {
        // 当前页
        content = JSON.stringify(await exportCurrent(config, body), null, 4)
    } else if (config.count === 2) {
        // 指定页
    } else if (config.count === 3) {
        // 全部
        content = JSON.stringify(await exportAll(config, body), null, 4)
    } else {
        throw new Error("导出类型未知")
    }
    BrowserUtil.download(content, config.name, "application/json");
}

async function exportCurrent(config: ExportConfig, body: BaseSearchItemBody): Promise<Array<any>> {
    let condition = QueryConditionBuild(body.conditions, 0, 0, body.orders);
    let current = (body.page - 1) * body.size;
    let end = body.page * body.size;
    let content = new Array<any>();
    while (current < end) {
        condition.from = current;
        condition.size = Math.min(config.size, body.size);
        current += condition.size;
        try {
            let items = await DocumentApi(body.index)._search(condition);
            content = content.concat(itemsBuild(config, items));
        } catch (e) {
            MessageUtil.error("导出异常", e);
        }
    }
    return Promise.resolve(content);
}

async function exportCustom(config: ExportConfig, body: BaseSearchItemBody): Promise<Array<any>> {
    return Promise.resolve([]);
}

async function exportAll(config: ExportConfig, body: BaseSearchItemBody): Promise<Array<any>> {
    let condition = QueryConditionBuild(body.conditions, 0, body.size, body.orders);
    let current = 0;
    let end = config.size + 1;
    let content = new Array<any>();
    while (current <= end) {
        condition.from = current;
        current += body.size;
        try {
            let items = await DocumentApi(body.index)._search(condition);
            end = Optional.ofNullable(items).attr("hits").attr("total").attr("value").orElse(0);
            content = content.concat(itemsBuild(config, items));
        } catch (e) {
            MessageUtil.error("导出异常", e);
        }
    }
    return Promise.resolve(content);

}

function itemsBuild(config: ExportConfig, content: any): Array<any> {
    let items = new Array<any>();
    let hits = Optional.ofNullable(content).attr("hits").attr("hits").orElse(new Array<any>());
    if (config.content === 1) {
        items = items.concat(hits);
    } else {
        hits.forEach(e => Optional.ofNullable(e["_source"]).then(value => items.push(value)));
    }
    return items;
}