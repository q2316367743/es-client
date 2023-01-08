<template>
    <el-scrollbar>
        <vxe-table :data="showTempRecords" :row-config="{isHover: true}" ref="tempRecordTable">
            <vxe-column type="seq" width="50" :title="$t('app.index')"/>
            <vxe-column field="method" title="请求方法" width="100"/>
            <vxe-column field="link" title="链接" width="250">
                <template #default="{row}">
                    <el-link type="primary" target="_blank">{{ row.link }}</el-link>
                    <div class="url-copy" @click="execCopy(row.link)">{{ $t('app.copy') }}</div>
                </template>
            </vxe-column>
            <vxe-column field="params" title="请求参数" width="280">
                <template #default="{row}">
                    <div class="temp-record-params">
                        <div class="temp-record-params-value" :title="row.params">{{ row.params }}</div>
                        <div class="url-copy" @click="execCopy(row.params)">{{ $t('app.copy') }}</div>
                    </div>
                </template>
            </vxe-column>
            <vxe-column :title="$t('app.operation')" width="270">
                <template #default="{ row }">
                    <el-button type="success" size="small" @click="execute(row)">执行</el-button>
                    <el-button type="primary" size="small" @click="appendToHistory(row)">新增到历史记录</el-button>
                    <el-button type="danger" size="small" @click="removeById(row.id)">{{ $t('app.delete') }}</el-button>
                </template>
            </vxe-column>
        </vxe-table>
    </el-scrollbar>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import HistoryEntity from "@/entity/HistoryEntity";
import useTempRecordStore from "@/store/TempRecordStore";
import BrowserUtil from "@/utils/BrowserUtil";
import {ElMessage, ElMessageBox} from "element-plus";
import {VxeTableInstance} from "vxe-table";
import {historyService} from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

export default defineComponent({
    name: 'hm-temp-record',
    data: () => ({
        showTempRecords: new Array<HistoryEntity>(),
    }),
    emits: ['execute'],
    created() {
        // 设置数据
        this.showTempRecords = useTempRecordStore().getRecords.sort((e1, e2) => e2.id! - e1.id!);
        emitter.on(MessageEventEnum.TEMP_RECORD_UPDATE, () => {
            // 重新加载数据
            let tempRecordTable = this.$refs['tempRecordTable'] as VxeTableInstance;
            tempRecordTable.reloadData(useTempRecordStore().getRecords.sort((e1, e2) => e2.id! - e1.id!));
        })
    },
    methods: {
        execCopy(url: string) {
            BrowserUtil.copy(url);
            ElMessage({
                showClose: true,
                type: 'success',
                message: '已成功复制到剪切板'
            })
        },
        execute(history: HistoryEntity) {
            this.$emit('execute', history);
        },
        removeById(id: number) {
            useTempRecordStore().removeById(id);
            this.$nextTick(() => {
                // 加载数据
                let tempRecordTable = this.$refs['tempRecordTable'] as VxeTableInstance;
                tempRecordTable.reloadData(useTempRecordStore().getRecords.sort((e1, e2) => e2.id! - e1.id!));
            })
        },
        appendToHistory(history: HistoryEntity) {
            // 输入名字
            ElMessageBox.prompt('请为此次查询命名', '新增历史记录', {
                confirmButtonText: '新增',
                cancelButtonText: '取消'
            }).then(({value}) => {
                historyService.save({
                    ...history,
                    name: value
                })
                    .then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '新增成功'
                        });
                        emitter.emit(MessageEventEnum.HISTORY_UPDATE);
                        // 删除此条记录
                        this.removeById(history.id!);
                    })
                    .catch(e => {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '新增失败，' + e
                        });
                    });
            })
        }
    }
});
</script>
<style lang="less">
.temp-record-params {
    display: flex;

    .temp-record-params-value {
        width: 200px;
        overflow: hidden;
        white-space: nowrap; //不折行
        text-overflow: ellipsis; //溢出显示省略号
    }
}
</style>