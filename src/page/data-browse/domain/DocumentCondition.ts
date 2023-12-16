import {ConditionItem, SortItem} from "@/page/data-browse/domain/DbConditionItem";
import {DocumentSearchQuery} from "@/components/es/domain/DocumentSearchQuery";
import {debounce} from "xe-utils";

const buildConditionItem = debounce((e: string): Array<ConditionItem> => {
    // TODO: 条件过滤
    return []
}, 500);

/**
 * 文档条件，一种中间态，上呈页面条件，下载实际搜索条件
 */
export class DocumentConditionGenerator {

    private _mustStr: string = "";
    private _mustNotStr: string = "";
    private _shouldStr: string = "";
    private _orderByStr: string = "";

    private must: Array<ConditionItem> = [];
    private mustNot: Array<ConditionItem> = [];
    private should: Array<ConditionItem> = [];
    private orderBy: Array<SortItem> = [];

    page: number = 1;
    size: number = 20;

    constructor(page: number, size: number) {
        this.page = page;
        this.size = size;
    }

    setMustStr(must: string) {
        this._mustStr = must;
        this.must = buildConditionItem(this._mustStr);

    }

    setMustNotStr(mustNot: string) {
        this._mustNotStr = mustNot;
        this.mustNot = buildConditionItem(this._mustNotStr);
    }

    setShouldStr(should: string) {
        this._shouldStr = should;
        this.should = buildConditionItem(this._shouldStr);
    }

    setOrderByStr(orderBy: string) {
        this._orderByStr = orderBy;
        this.orderBy = buildConditionItem(this._orderByStr);
    }

    get mustStr(): string {
        return this._mustStr;
    }

    get mustNotStr(): string {
        return this._mustNotStr;
    }

    get shouldStr(): string {
        return this._shouldStr;
    }

    get orderByStr(): string {
        return this._orderByStr;
    }


    private buildItem(e: ConditionItem): Record<string, any> {
        const c: Record<string, any> = {};
        const a: Record<string, any> = {};
        a[e.field] = e.value;
        c[e.type] = a;
        return c;
    }

    private buildSort(): Record<string, any> {
        const s: Record<string, any> = {};
        for (let i of this.orderBy) {
            s[i.field] = {
                order: i.type
            };
        }
        return s;
    }

    buildSearchQuery(): DocumentSearchQuery {
        return {
            sort: this.buildSort(),
            query: {
                bool: {
                    must: this.must.map(this.buildItem),
                    should: this.should.map(this.buildItem),
                    must_not: this.mustNot.map(this.buildItem)
                }
            },
            aggs: {},
            from: this.page,
            size: this.size
        }
    }

}
