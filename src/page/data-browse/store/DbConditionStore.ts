import {Ref, ref} from "vue";
import {createGlobalState} from "@vueuse/core";
import {
    ConditionKey,
    DocumentSearchQuery, SortConditionType,
} from "@/components/es/domain/DocumentSearchQuery";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {
    conditionConvert,
    conditionRender,
    orderByBuild, orderByConvert,
    orderByRender,
    templateBuild
} from "@/page/data-browse/build/ConditionBuild";
import {ConditionItem, SortItem} from "@/page/data-browse/domain/DbConditionItem";
import MessageUtil from "@/utils/MessageUtil";

type Type = 'must' | 'mustNot' | 'should';

function addOneCondition(items: Array<ConditionItem>, field: string, key: ConditionKey, value: string): string {
    const index = items.findIndex(e => e.field === field);
    if (index > -1) {
        // 存在此条件，变化
        items[index].value = value;
    }else {
        items.push({field, type: key, value})
    }
    return conditionConvert(items);
}

function removeOneCondition(items: Array<ConditionItem>, field: string, key: ConditionKey): string {
    const index = items.findIndex(e => e.field === field);
    if (index > -1) {
        // 存在此条件，变化
        items.splice(index, 1);
    }
    return conditionConvert(items);
}

function addOneSort(items: Array<SortItem>, field: string, key: SortConditionType) {
    const index = items.findIndex(e => e.field === field);
    if (index > -1) {
        // 存在此条件，变化
        items[index].type = key;
    }else {
        items.push({field, type: key})
    }
    return orderByConvert(items);
}

function removeOneSort(items: Array<SortItem>, field: string) {
    const index = items.findIndex(e => e.field === field);
    if (index > -1) {
        // 存在此条件，变化
        items.splice(index, 1);
    }
    return orderByConvert(items);
}


export const useDbConditionStore = createGlobalState(() => {

    const page = ref(1);
    const size = ref(useGlobalSettingStore().getPageSize);
    const must: Ref<string> = ref('');
    const mustNot: Ref<string> = ref('');
    const should: Ref<string> = ref('');
    const orderBy: Ref<string> = ref('');

    function addCondition(type: Type, field: string, key: ConditionKey, value: string) {
        switch (type) {
            case "must":
                must.value = addOneCondition(templateBuild(must.value), field, key, value);
                break;
            case "should":
                should.value = addOneCondition(templateBuild(should.value), field, key, value);
                break;
            case "mustNot":
                mustNot.value = addOneCondition(templateBuild(mustNot.value), field, key, value);
                break;
            default:
                MessageUtil.warning("条件类型错误");
                break;
        }
    }

    function removeCondition(type: Type, field: string, key: ConditionKey) {
        switch (type) {
            case "must":
                must.value = removeOneCondition(templateBuild(must.value), field, key);
                break;
            case "should":
                should.value = removeOneCondition(templateBuild(should.value), field, key);
                break;
            case "mustNot":
                mustNot.value = removeOneCondition(templateBuild(mustNot.value), field, key);
                break;
            default:
                MessageUtil.warning("条件类型错误");
                break;
        }
    }

    function addOrderBy(field: string, type: SortConditionType) {
        orderBy.value = addOneSort(orderByBuild(orderBy.value), field, type);
    }

    function removeOrderBy(field: string) {
        orderBy.value = removeOneSort(orderByBuild(orderBy.value), field);
    }

    function buildSearchQuery(): DocumentSearchQuery {
        return {
            sort: orderByRender(orderByBuild(orderBy.value)),
            query: {
                bool: {
                    must: conditionRender(templateBuild(must.value)),
                    should: conditionRender(templateBuild(should.value)),
                    must_not: conditionRender(templateBuild(mustNot.value))
                }
            },
            aggs: {},
            from: Math.max(0, page.value - 1) * size.value,
            size: size.value
        };
    }

    return {
        page, size, must, mustNot, should, orderBy,
        addCondition, removeCondition, addOrderBy, removeOrderBy, buildSearchQuery
    };
})
