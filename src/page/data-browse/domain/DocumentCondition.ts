import {ConditionItem, SortItem} from "@/page/data-browse/domain/DbConditionItem";
import {ConditionKey, DocumentSearchQuery} from "@/components/es/domain/DocumentSearchQuery";
import {orderByBuild, templateBuild, templateRender} from "@/page/data-browse/build/ConditionBuild";
import {ref, Ref, watch} from "vue";
import {createGlobalState} from "@vueuse/core";

/**
 * 文档条件，一种中间态，上呈页面条件，下载实际搜索条件
 */


let must: Array<ConditionItem> = [];
let mustNot: Array<ConditionItem> = [];
let should: Array<ConditionItem> = [];
let orderBy: Array<SortItem> = [];


function buildItem(e: ConditionItem): Record<string, any> {
    const c: Record<string, any> = {};
    const a: Record<string, any> = {};
    a[e.field] = e.value;
    c[e.type] = a;
    return c;
}

function buildSort(): Record<string, any> {
    const s: Record<string, any> = {};
    for (let i of orderBy) {
        s[i.field] = {
            order: i.type
        };
    }
    return s;
}

export function buildSearchQuery(): DocumentSearchQuery {
    const {page, size} = useDbConditionState();
    console.log(must, should, mustNot, orderBy)
    return {
        sort: buildSort(),
        query: {
            bool: {
                must: must.map(buildItem),
                should: should.map(buildItem),
                must_not: mustNot.map(buildItem)
            }
        },
        aggs: {},
        from: (page.value - 1) * size.value,
        size: size.value
    }
}

export function addCondition(condition: func, field: string, type: ConditionKey, value: string) {
    const {mustStr, shouldStr, mustNotStr} = useDbConditionState();
    if (condition === 'must') {
        renderCondition(must, field, type, value);
        mustStr.value = templateRender(must);
    } else if (condition === 'should') {
        renderCondition(should, field, type, value);
        shouldStr.value = templateRender(should);
    } else if (condition === 'mustNot') {
        renderCondition(mustNot, field, type, value);
        mustNotStr.value = templateRender(mustNot);
    }
}

function renderCondition(items: Array<ConditionItem>, field: string, type: ConditionKey, value: string) {
    let empty = true;
    for (let item of items) {
        if (item.field === field) {
            item.value = value;
            empty = false;
            break;
        }
    }
    if (empty) {
        // 不存在，则新增
        items.push({
            field: field,
            type: type,
            value: value
        });
    }
}

type func = 'must' | 'mustNot' | 'should';

export const useDbConditionState = createGlobalState(() => {
    const page = ref(1);
    const size = ref(10);
    const mustStr: Ref<string> = ref('');
    const mustNotStr: Ref<string> = ref('');
    const shouldStr: Ref<string> = ref('');
    const orderByStr: Ref<string> = ref('');
    watch(() => mustStr.value, e => must = templateBuild(e));
    watch(() => mustNotStr.value, e => mustNot = templateBuild(e));
    watch(() => shouldStr.value, e => should = templateBuild(e));
    watch(() => orderByStr.value, e => orderBy = orderByBuild(e));
    return {page, size, mustStr, mustNotStr, shouldStr, orderByStr}
})
