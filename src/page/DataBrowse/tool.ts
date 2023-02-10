import {VxeTableDefines, VxeTablePropTypes} from "vxe-table";
import IndexView from "@/view/index/IndexView";
import DocumentApi from "@/api/DocumentApi";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default {
    renderMenu(): VxeTablePropTypes.MenuConfig {
        let body = {
            options: [[{
                code: 'copy',
                name: '复制',
                prefixIcon: 'vxe-icon-copy',
            }], [{
                code: 'add',
                name: '新增',
                prefixIcon: 'vxe-icon-add'
            }, {
                code: 'update',
                name: '修改',
                prefixIcon: 'vxe-icon-edit'
            }, {
                code: 'delete',
                name: '删除',
                prefixIcon: 'vxe-icon-delete'
            }]]
        } as VxeTableDefines.MenuOptions;

        let last = [] as VxeTableDefines.MenuFirstOption[];

        // 确定筛选
        for (let name of ['must', 'should', 'must not']) {
            last.push({
                code: `null-${name}`,
                name: `筛选 - ${name}`,
                children: [{
                    code: `query|${name}|=`,
                    name: 'term'
                }, {
                    code: `query|${name}|match`,
                    name: 'match'
                }]
            });
        }
        // 排序
        last.push({
            name: '排序',
            prefixIcon: 'vxe-icon-sort',
            children: [{
                code: 'sort-clear',
                name: '清除排序',
                prefixIcon: 'vxe-icon-delete-fill'
            }, {
                code: 'sort-asc',
                name: 'asc',
                prefixIcon: 'vxe-icon-caret-up'
            }, {
                code: 'sort-desc',
                name: 'desc',
                prefixIcon: 'vxe-icon-caret-down'
            }]
        });

        body.options?.push(last)
        return {
            body
        } as VxeTablePropTypes.MenuConfig
    },
    recordReduce(deleteRowIndies: Set<string>, index?: IndexView,): Promise<void> | void {
        if (!index) {
            return;
        }
        if (deleteRowIndies.size === 0) {
            return;
        }
        return new Promise<void>((resolve, reject) => {
            MessageBoxUtil.confirm("确定要删除这些索引，删除后将无法恢复！", "警告", {
                confirmButtonText: '删除',
                cancelButtonText: '跳转到高级搜索'
            }).then(() => {
                let ids = new Array<string>();
                deleteRowIndies.forEach(id => ids.push(id));
                DocumentApi._delete_by_query(index?.name!, {
                    query: {
                        bool: {
                            must: [
                                {
                                    ids: {
                                        values: ids
                                    }
                                }
                            ]
                        }
                    }
                }).then(() => MessageUtil.success('删除成功', resolve))
                    .catch(e => MessageUtil.error('删除失败', e));
            }).catch((action) => {
                if (action === 'cancel') {
                    // 跳转到高级查询
                    reject();
                }
            });
        })
    },
    pageSizeChange(command: string, executeQuery: () => void, callback: (page: number, size: number) => void) {
        switch (command) {
            case "1":
                callback(1, 10);
                executeQuery();
                break;
            case "2":
                callback(1, 100);
                executeQuery();
                break;
            case "3":
                callback(1, 250);
                executeQuery();
                break;
            case "4":
                callback(1, 500);
                executeQuery();
                break;
            case "5":
                callback(1, 1000);
                executeQuery();
                break;
            case "6":
                MessageBoxUtil.prompt('请输入自定义分页大小', '自定义分页', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\d+/,
                    inputErrorMessage: '请输入正确的数字',
                })
                    .then((value) => {
                        callback(1, parseInt(value));
                        executeQuery();
                    })
                    .catch(() => {
                    });
                break
        }
    }
}