<template>
    <div class="temp-record">
        <div class="temp-record-head">
            <div>
                <el-input v-model="condition.link" style="width: 200px;" placeholder="链接" @input="loadData" clearable/>
                <el-select v-model="condition.method" style="margin-left: 12px;" placeholder="请求方式" clearable @change="loadData">
                    <el-option label="HEAD" value="HEAD" />
                    <el-option label="GET" value="GET" />
                    <el-option label="POST" value="POST" />
                    <el-option label="PUT" value="PUT" />
                    <el-option label="DELETE" value="DELETE" />
                </el-select>
            </div>
            <div>
                <el-button type="danger" :icon="deleteIcon" @click="reset">清空</el-button>
            </div>
        </div>
        <div class="temp-record-body">
            <el-scrollbar>
                <vxe-table :data="tempRecords" :row-config="{isHover: true}" ref="tempRecordTable">
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
                            <el-button type="success" size="small" @click="load(row)">载入</el-button>
                            <el-button type="primary" size="small" @click="appendToHistory(row)">新增到历史记录</el-button>
                            <el-button type="danger" size="small" @click="removeById(row.id)">{{ $t('app.delete') }}</el-button>
                        </template>
                    </vxe-column>
                </vxe-table>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Delete} from "@element-plus/icons-vue";
import {VxeTableInstance} from "vxe-table";

import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import useTempRecordStore from "@/store/TempRecordStore";
import BrowserUtil from "@/utils/BrowserUtil";
import {seniorSearchHistoryService} from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import { stringContain } from "@/utils/SearchUtil";
import useUrlStore from "@/store/UrlStore";
import Optional from "@/utils/Optional";

export default defineComponent({
    name: 'hm-temp-record',
    emits: ['load'],
    data: () => ({
        tempRecords: new Array<SeniorSearchHistory>(),
        condition: {
            link: '',
            method: ''
        },
        deleteIcon: markRaw(Delete)
    }),
    created() {
        // 设置数据
        this.tempRecords = this.renderRecord(useTempRecordStore().getRecords);
        emitter.on(MessageEventEnum.TEMP_RECORD_UPDATE, () => {
            // 重新加载数据
            this.loadData();
        });
    },
    methods: {
        renderRecord(showTempRecords: Array<SeniorSearchHistory>): Array<SeniorSearchHistory> {
            showTempRecords = showTempRecords.sort((e1, e2) => e2.id! - e1.id!);
            if (this.condition.link !== '') {
                showTempRecords = showTempRecords.filter(e => stringContain(e.link, this.condition.link));
            }
            if (this.condition.method !== '') {
                showTempRecords = showTempRecords.filter(e => e.method === this.condition.method);
            }
            return showTempRecords;
        },
        loadData() {
            let tempRecordTable = this.$refs['tempRecordTable'] as VxeTableInstance;
            tempRecordTable.reloadData(this.renderRecord(useTempRecordStore().getRecords));
        },
        execCopy(url: string) {
            BrowserUtil.copy(url);
            ElMessage({
                showClose: true,
                type: 'success',
                message: '已成功复制到剪切板'
            })
        },
        load(history: SeniorSearchHistory) {
            this.$emit('load', history);
        },
        removeById(id: number) {
            useTempRecordStore().removeById(id);
            this.$nextTick(() => {
                // 加载数据
                this.loadData();
            })
        },
        appendToHistory(history: SeniorSearchHistory) {
            // 输入名字
            ElMessageBox.prompt('请为此次查询命名', '新增历史记录', {
                confirmButtonText: '新增',
                cancelButtonText: '取消',
                inputPattern: /.+/,
                inputErrorMessage: '名称为必填'
            }).then(({value}) => {
                seniorSearchHistoryService.save({
                    ...history,
                    name: value,
                    urlId: Optional.ofNullable(useUrlStore().id).orElse(0)
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
        },
        reset() {
            useTempRecordStore().reset();
            this.$nextTick(() => {
                // 加载数据
                this.loadData();
            });
        }
    }
});
</script>
<style lang="less">


.temp-record {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .temp-record-head {
        display: flex;
        justify-content: space-between;
        padding: 0.55em 0;
    }

    .temp-record-body {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;

        .temp-record-params {
            display: flex;

            .temp-record-params-value {
                width: 200px;
                overflow: hidden;
                white-space: nowrap; //不折行
                text-overflow: ellipsis; //溢出显示省略号
            }
        }

    }
}
</style>