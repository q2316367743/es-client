<template>
    <div>
        <el-table :data="urls" class="data">
            <el-table-column type="index" width="150" :label="$t('setting.link.index')"></el-table-column>
            <el-table-column prop="name" :label="$t('setting.link.name')" width="180"></el-table-column>
            <el-table-column prop="value" :label="$t('setting.link.url')"></el-table-column>
            <el-table-column :label="$t('setting.link.create_time')" width="240">
                <template #default="scope">
                    <div>{{ prettyDate(scope.row.create_time) }}</div>
                </template>
            </el-table-column>
            <el-table-column :label="$t('setting.link.operation')">
                <template #default="scope">
                    <el-button
                        type="primary"
                        size="small"
                        @click="edit_open(scope.row)"
                    >{{ $t('setting.link.edit') }}
                    </el-button>
                    <el-button
                        type="danger"
                        size="small"
                        @click="remove(scope.row.id, scope.row.value)"
                    >{{ $t('setting.link.delete') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button
            type="primary"
            circle
            class="add-btn"
            @click="edit_dialog = true; edit_save = true;"
        >+
        </el-button>
        <el-dialog
            :title="(edit_save ? $t('setting.link.add') : $t('setting.link.update')) + ' ' + $t('setting.link.url')"
            v-model="edit_dialog"
            width="600px"
        >
            <el-form :model="url" label-width="100px" ref="urlForm" :rules="url_rules">
                <el-form-item :label="$t('setting.link.name')" prop="name">
                    <el-input v-model="url.name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('setting.link.url')" prop="value">
                    <el-input v-model="url.value" :placeholder="$t('setting.link.url_placeholder')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('setting.link.sequence')" prop="sequence">
                    <el-input-number v-model="url.sequence" controls-position="right" size="large"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="test">{{ $t('setting.link.test') }}</el-button>
                <el-button
                    type="primary"
                    @click="url_submit"
                >{{ edit_save ? $t('setting.link.add') : $t('setting.link.update') }}
                </el-button>
            </template>
        </el-dialog>
        <json-dialog
            v-model="test_dialog"
            :json="test_data"
            :title="$t('setting.link.result')"
            open
        ></json-dialog>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {ElMessageBox, ElMessage} from 'element-plus'
import type {ElForm} from 'element-plus'
import dayjs from 'dayjs'
import {mapState} from "pinia";
import axios from 'axios';

import {useUrlStore} from "@/store/UrlStore";
import {useIndexStore} from "@/store/IndexStore";
import url_dao from "@/dao/UrlDao";
import Url from "@/entity/Url";
import JsonDialog from "@/component/JsonDialog.vue";

export default defineComponent({
    components: {JsonDialog},
    data: () => ({
        url: {
            name: '',
            value: 'http://',
            sequence: 0,
        } as Url,
        url_rules: {
            name: [
                {
                    required: true,
                    message: '请输入链接名',
                    trigger: 'blur',
                }
            ],
            value: [
                {
                    required: true,
                    message: '请输入链接',
                    trigger: 'blur',
                }
            ],
            sequence: [
                {
                    required: true,
                    message: '请输入排序',
                    trigger: 'blur',
                }
            ]
        },
        edit_dialog: false,
        edit_save: true,
        test_dialog: false,
        test_data: {} as any
    }),
    computed: {
        ...mapState(useUrlStore, ['urls'])
    },
    created() {
        useUrlStore().reset()
    },
    methods: {
        prettyDate(date: Date) {
            return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
        },
        remove(id: number, value: string) {
            ElMessageBox.confirm('此操作将永久删除该链接, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                url_dao.deleteById(id, () => {
                    ElMessage({
                        message: '删除成功',
                        type: 'success'
                    });
                    if (useUrlStore().current === value) {
                        useUrlStore().choose("");
                    }
                    useUrlStore().reset();
                    useIndexStore().reset();
                })
            })
        },
        edit_open(url: Url) {
            this.url = url;
            this.edit_save = false;
            this.edit_dialog = true;
        },
        url_submit() {
            let urlForm = this.$refs.urlForm as InstanceType<typeof ElForm>;
            urlForm.validate((valid) => {
                if (valid) {
                    if (this.edit_save) {
                        // 新增
                        url_dao.insert({
                            name: this.url.name,
                            value: this.url.value,
                            sequence: this.url.sequence
                        }, () => {
                            useUrlStore().reset();
                            ElMessage.success('新增成功');
                        });
                    } else {
                        // 更新
                        url_dao.updateById({
                            name: this.url.name,
                            value: this.url.value,
                            sequence: this.url.sequence
                            // eslint-disable-next-line
                        }, this.url.id!, () => {
                            useUrlStore().reset();
                            ElMessage.success('更新成功');
                        });
                    }
                    this.edit_dialog = false;
                    // 重置数据
                    this.url = {
                        name: '',
                        value: 'http://',
                        sequence: 0,
                    }
                }
            });
        },
        test() {
            let urlForm = this.$refs.urlForm as InstanceType<typeof ElForm>;
            urlForm.validate((valid) => {
                if (valid) {
                    axios({
                        baseURL: this.url.value,
                        url: '/',
                        method: 'GET',
                    }).then((response) => {
                        this.test_dialog = true;
                        this.test_data = response.data;
                    }).catch((e) => {
                        console.error(e);
                        ElMessage.error('连接失败');
                    });
                }
            })
        }
    }
});
</script>
<style lang="less">
.setting {
    .el-card__body {
        .data {
            width: 100%;
        }

        .page {
            text-align: center;
            position: absolute;
            left: 5px;
            right: 5px;
            bottom: 20px;
        }

        .add-btn {
            position: absolute;
            right: 20px;
            bottom: 20px;
            width: 32px;
        }
    }
}
</style>