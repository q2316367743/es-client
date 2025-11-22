import {VxeTableEvents, VxeTableInstance} from "vxe-table";
import MessageUtil from "@/utils/MessageUtil";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {useDbConditionStore} from "@/page/data-browse/store/DbConditionStore";
import {statistics} from "@/global/BeanFactory";
import {execUpdate} from "@/page/data-browse/component/DbHeader/func";
import {copyText} from "@/utils/BrowserUtil";
import {stringifyJsonWithBigIntSupport} from "@/algorithm/format";


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
    if ($table) {
      const records = $table.getCheckboxRecords()
      useDataBrowseStore().updateSelectKeys(records)
    }
  }
}

export function buildContextMenuClickEvent(instance: Ref<VxeTableInstance | null>): VxeTableEvents.MenuClick {
  return ({menu, row, column}) => {
    const $table = instance.value;
    const field = column.field;
    statistics.access("func_data_browser", "使用右键菜单")
    switch (menu.code) {
      case 'copy':
        // 示例
        if (row && column) {
          copyText(row[column.field])
          MessageUtil.info("已复制到剪贴板！")
        }
        break
      case 'copyText-row':
        if (row) {
          copyText(stringifyJsonWithBigIntSupport(row))
          MessageUtil.info("已复制到剪贴板！")
        }
        break;
      case 'operation-edit':
        execUpdate(useDataBrowseStore().name, row['_id'], row['_source'])
          .then(({id, data}) => useDataBrowseStore().update(id, data)
            .then(() => MessageUtil.success("更新成功"))
            .catch(e => MessageUtil.error("更新失败", e)));
        break;
      case 'operation-delete':
        useDataBrowseStore().reduce([row['_id']])
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
      case 'must-clear': {
        useDbConditionStore().removeCondition('must', field, 'term');
        useDataBrowseStore().executeQuery(false).then(() => console.log("已清空must条件"));
        break
      }
      case 'should-clear': {
        useDbConditionStore().removeCondition('should', field, 'term');
        useDataBrowseStore().executeQuery(false).then(() => console.log("已清空should条件"));
        break
      }
      case 'must_not-clear': {
        useDbConditionStore().removeCondition('mustNot', field, 'term');
        useDataBrowseStore().executeQuery(false).then(() => console.log("已清空must_not条件"));
        break
      }
      case 'sort-clear': {
        useDbConditionStore().removeOrderBy(field);
        useDataBrowseStore().executeQuery(false).then(() => console.log("已清空排序条件"));
        break
      }
      case "must-term": {
        useDbConditionStore().addCondition('must', field, 'term', row[field]);
        useDataBrowseStore().executeQuery(false).then(() => console.log("执行must-term查询"));
        break
      }
      case "must-match": {
        useDbConditionStore().addCondition('must', field, 'match', row[field]);
        useDataBrowseStore().executeQuery(false).then(() => console.log("执行must-match查询"));
        break
      }
      case "should-term": {
        useDbConditionStore().addCondition('should', field, 'term', row[field]);
        useDataBrowseStore().executeQuery(false).then(() => console.log("执行must-term查询"));
        break
      }
      case "should-match": {
        useDbConditionStore().addCondition('should', field, 'match', row[field]);
        useDataBrowseStore().executeQuery(false).then(() => console.log("执行must-match查询"));
        break
      }
      case "must_not-term": {
        useDbConditionStore().addCondition('mustNot', field, 'term', row[field]);
        useDataBrowseStore().executeQuery(false).then(() => console.log("执行must-term查询"));
        break
      }
      case "must_not-match": {
        useDbConditionStore().addCondition('mustNot', field, 'match', row[field]);
        useDataBrowseStore().executeQuery(false).then(() => console.log("执行must-match查询"));
        break
      }
      case "sort-asc": {
        useDbConditionStore().addOrderBy(field, 'asc');
        useDataBrowseStore().executeQuery(false).then(() => console.log("执行must-term查询"));
        break
      }
      case "sort-desc": {
        useDbConditionStore().addOrderBy(field, 'desc');
        useDataBrowseStore().executeQuery(false).then(() => console.log("执行must-match查询"));
        break
      }
      default:
        MessageUtil.info(`点击了 ${menu.name} 选项`)
    }
  }
}
