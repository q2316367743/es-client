import {VxeTablePropTypes} from "vxe-table";

export const menuConfig: VxeTablePropTypes.MenuConfig = {
    header: {
        options: [
            [
                {
                    code: 'must',
                    name: 'must',
                    visible: true,
                    disabled: false,
                    children: [
                        {code: 'must-clear', name: '清除筛选', visible: true, disabled: false},
                    ]
                },
                {
                    code: 'should',
                    name: 'should',
                    visible: true,
                    disabled: false,
                    children: [
                        {code: 'should-clear', name: '清除筛选', visible: true, disabled: false},
                    ]
                },
                {
                    code: 'must_not',
                    name: 'must not',
                    visible: true,
                    disabled: false,
                    children: [
                        {code: 'must_not-clear', name: '清除筛选', visible: true, disabled: false},
                    ]
                },
                {
                    code: 'sort',
                    name: '排序',
                    visible: true,
                    disabled: false,
                    children: [
                        {code: 'sort-clear', name: '清除排序', visible: true, disabled: false},
                        {code: 'sort-asc', name: '升序', visible: true, disabled: false},
                        {code: 'sort-desc', name: '倒序', visible: true, disabled: false}
                    ]
                },
            ]
        ]
    },
    body: {
        options: [
            [
                {code: 'copy', name: '复制', prefixIcon: 'vxe-icon-copyText', visible: true},
                {code: 'copyText-row', name: '复制当前行', prefixIcon: 'vxe-icon-copyText', visible: true},
            ],
            [
                {code: 'operation-edit', name: '编辑', prefixIcon: 'vxe-icon-edit',visible: true},
                {code: 'operation-delete', name: '删除', prefixIcon: 'vxe-icon-delete',visible: true}
            ],
            [
                {code: 'expand', name: '展开/收起当前行', visible: true},
                {code: 'select', name: '选中/取消当前行', visible: true}
            ],
            [
                {
                    code: 'must',
                    name: 'must',
                    visible: true,
                    disabled: false,
                    children: [
                        {code: 'must-clear', name: '清除筛选', visible: true, disabled: false},
                        {code: 'must-term', name: 'term', visible: true, disabled: false},
                        {code: 'must-match', name: 'match', visible: true, disabled: false},
                    ]
                },
                {
                    code: 'should',
                    name: 'should',
                    visible: true,
                    disabled: false,
                    children: [
                        {code: 'should-clear', name: '清除筛选', visible: true, disabled: false},
                        {code: 'should-term', name: 'term', visible: true, disabled: false},
                        {code: 'should-match', name: 'match', visible: true, disabled: false},
                    ]
                },
                {
                    code: 'must_not',
                    name: 'must not',
                    visible: true,
                    disabled: false,
                    children: [
                        {code: 'must_not-clear', name: '清除筛选', visible: true, disabled: false},
                        {code: 'must_not-term', name: 'term', visible: true, disabled: false},
                        {code: 'must_not-match', name: 'match', visible: true, disabled: false},
                    ]
                },
                {
                    code: 'sort',
                    name: '排序',
                    visible: true,
                    disabled: false,
                    children: [
                        {code: 'sort-clear', name: '清除筛选', visible: true, disabled: false},
                        {code: 'sort-asc', name: '正序', visible: true, disabled: false},
                        {code: 'sort-desc', name: '倒序', visible: true, disabled: false}
                    ]
                },
            ]
        ]
    },
};

export const columnConfig: VxeTablePropTypes.ColumnConfig = {
    resizable: true,
};

export const rowConfig: VxeTablePropTypes.RowConfig = {
    keyField: '_id',
    isCurrent: true,
    isHover: true
};
