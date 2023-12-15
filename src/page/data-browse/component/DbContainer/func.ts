import type {ListTableConstructorOptions} from "@visactor/vtable/es/ts-types";
import {ColumnDefine} from "@visactor/vtable";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {TableViewColumnData} from "@/algorithm/jsonToTable";

export function buildOption():ListTableConstructorOptions{
    return  {
        records: useDataBrowseStore().records,
        columns: transferColumns(useDataBrowseStore().showColumns),
        widthMode: 'standard',
        menu: {
            contextMenuItems: [{
                menuKey: 'copy-one',
                text: "复制单元格内容"
            }, {
                menuKey: 'copy-line',
                text: '复制当前行'
            }, {
                menuKey: 'show-source',
                text: '查看源数据'
            }],
        },
        allowFrozenColCount: 5,
        frozenColCount: 1,
        showFrozenIcon: true
    };
}

export function transferColumns(items: Array<TableViewColumnData>): Array<ColumnDefine> {
    const columns = new Array<ColumnDefine>();
    items.map(transfer).map(e => columns.push(e));
    if (columns.length > 0) {
        columns.unshift({
            field: 'isCheck',
            title: '',
            width: 60,
            headerType: 'checkbox',
            cellType: 'checkbox'
        })
    }
    return columns;
}

export function transfer(e: TableViewColumnData): ColumnDefine {
    return {
        field: e.dataIndex,
        title: e.title,
        width: 'auto',
        cellType: 'text',
    }
}
