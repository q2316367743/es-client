import {VxeTableEvents, VxeTableInstance} from "vxe-table";
import MessageUtil from "@/utils/MessageUtil";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {Ref} from "vue";


export function buildSelectAllChangeEvent(instance: Ref<VxeTableInstance | null>): VxeTableEvents.CheckboxAll {
    return () => {
        const $table = instance.value;
        if ($table) {
            const records = $table.getCheckboxRecords()
            useDataBrowseStore().updateSelectKeys(records)
        }
    }
}

export function buildSelectChangeEvent(instance: Ref<VxeTableInstance | null>): VxeTableEvents.CheckboxChange {
    return () => {
        const $table = instance.value;
        console.log("$table", $table)
        if ($table) {
            const records = $table.getCheckboxRecords()
            useDataBrowseStore().updateSelectKeys(records)
        }
    }
}

export function buildContextMenuClickEvent(instance: Ref<VxeTableInstance | null>): VxeTableEvents.MenuClick {
    return ({menu, row, column}) => {
        const $table = instance.value;
        switch (menu.code) {
            case 'copy':
                // 示例
                if (row && column) {
                    utools.copyText(row[column.field])
                    MessageUtil.info("已复制到剪贴板！")
                }
                break
            case 'copy-row':
                if (row) {
                    utools.copyText(JSON.stringify(row))
                    MessageUtil.info("已复制到剪贴板！")
                }
                break;
            case 'expand':
                if ($table) {
                    $table.toggleRowExpand(row).then(() => console.log("切换行展收状态成功"))
                }
                break;
            case 'select':
                if ($table) {
                    $table.toggleCheckboxRow(row).then(() => console.log("切换行选择状态成功"))
                }
                break;
            case 'must-clear':{
                useDataBrowseStore().updateMust("");
                useDataBrowseStore().executeQuery(false).then(() => console.log("已清空must条件"));
                break
            }
            case 'should-clear':{
                useDataBrowseStore().updateShould("");
                useDataBrowseStore().executeQuery(false).then(() => console.log("已清空should条件"));
                break
            }
            case 'must_not-clear':{
                useDataBrowseStore().updateMustNot("");
                useDataBrowseStore().executeQuery(false).then(() => console.log("已清空must_not条件"));
                break
            }
            case 'sort-clear':{
                useDataBrowseStore().updateOrderBy("");
                useDataBrowseStore().executeQuery(false).then(() => console.log("已清空排序条件"));
                break
            }
            case "must-term": {
                let condition = useDataBrowseStore().getCondition();
            }
            default:
                MessageUtil.info(`点击了 ${menu.name} 选项`)
        }
    }
}
