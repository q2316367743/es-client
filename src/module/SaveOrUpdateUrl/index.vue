<template>
    <el-dialog :title="$t('setting.link.add') + $t('setting.link.url')" v-model="dialog" width="600px" draggable
               :close-on-click-modal="false" destroy-on-close>
        <el-form :model="url" label-width="100px" ref="urlForm" :rules="rules">
            <el-form-item :label="$t('setting.link.name')" prop="name">
                <el-input v-model="url.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.link.url')" prop="value">
                <el-input v-model="url.value" :placeholder="$t('setting.link.url_placeholder')">
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.link.sequence')" prop="sequence">
                <el-input-number v-model="url.sequence" controls-position="right" size="large"/>
            </el-form-item>
            <el-form-item :label="$t('setting.link.is_auth')" prop="isAuth">
                <el-switch v-model="url.isAuth" size="large" active-text="true" inactive-text="false"/>
            </el-form-item>
            <el-form-item :label="$t('setting.link.auth_user')" prop="authUser" v-if="url.isAuth">
                <el-input v-model="url.authUser" size="large"/>
            </el-form-item>
            <el-form-item :label="$t('setting.link.auth_password')" prop="authPassword" v-if="url.isAuth">
                <el-input v-model="url.authPassword" size="large"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-popover :visible="testDialog" placement="top" :width="300" trigger="click">
                <el-result :icon="testData.icon" :title="testData.title" :sub-title="testData.name">
                    <template #extra>
                        <div v-if="testData.icon === 'success'">elasticsearch版本：{{ testData.version }}</div>
                        <div v-if="testData.icon === 'success'">lucene版本：{{ testData.luceneVersion }}</div>
                        <div>
                            <el-button @click="testDialog = false">关闭</el-button>
                        </div>
                    </template>
                </el-result>
                <template #reference>
                    <el-button @click="test">{{ $t('setting.link.test') }}</el-button>
                </template>
            </el-popover>
            <el-button type="primary" @click="submit">{{ isSave ? $t('setting.link.add') : $t('setting.link.update') }}
            </el-button>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {ElForm, ElMessage} from "element-plus";

import Url from '@/entity/Url';

import {urlService} from '@/global/BeanFactory';
import useUrlStore from '@/store/UrlStore';
import {httpStrategyContext} from "@/global/BeanFactory";

export default defineComponent({
    name: 'SaveOrUpdateUrl',
    props: {
        modelValue: Boolean,
        source: Object as PropType<Url>
    },
    data: () => ({
        url: {
            name: '',
            value: 'http://',
            sequence: 0,
            isAuth: false,
            authUser: '',
            authPassword: ''
        } as Url,
        dialog: false,
        isSave: true,
        rules: {
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
        testDialog: false,
        testData: {
            icon: 'success',
            title: '',
            name: '',
            version: '',
            luceneVersion: ''
        }
    }),
    created() {
        this.dialog = this.modelValue;
        if (this.source && this.source?.id) {
            this.isSave = false;
            this.url = this.source;
        } else {
            this.isSave = true;
        }
    },
    watch: {
        dialog(newValue) {
            this.$emit('update:modelValue', newValue);
        },
        modelValue(newValue) {
            this.dialog = newValue;
        },
        source(newValue) {
            this.url = newValue
            this.isSave = !(newValue && newValue?.id);
        }
    },
    methods: {
        submit() {
            let urlForm = this.$refs.urlForm as InstanceType<typeof ElForm>;
            urlForm.validate((valid) => {
                if (valid) {
                    if (this.isSave) {
                        // 新增
                        urlService.insert({
                            name: this.url.name,
                            value: this.url.value,
                            sequence: this.url.sequence,
                            isAuth: this.url.isAuth,
                            authUser: this.url.authUser,
                            authPassword: this.url.authPassword
                        }).then(() => {
                            useUrlStore().reset();
                            ElMessage({
                                showClose: true,
                                type: 'success',
                                message: '新增成功'
                            });
                        }).catch(e => {
                            ElMessage({
                                showClose: true,
                                type: 'success',
                                message: '新增失败，' + e
                            });
                        });
                    } else {
                        // 更新
                        urlService.updateById({
                            name: this.url.name,
                            value: this.url.value,
                            sequence: this.url.sequence,
                            createTime: this.url.createTime || new Date(),
                            isAuth: this.url.isAuth,
                            authUser: this.url.authUser,
                            authPassword: this.url.authPassword
                            // eslint-disable-next-line
                        }, this.url.id!).then(() => {
                            useUrlStore().reset();
                            ElMessage({
                                showClose: true,
                                type: 'success',
                                message: '修改成功'
                            });
                        }).catch(e => {
                            ElMessage({
                                showClose: true,
                                type: 'success',
                                message: '修改失败，' + e
                            });
                        });
                    }
                    this.url = {
                        name: '',
                        value: 'http://',
                        sequence: 0,
                        isAuth: false,
                        authUser: '',
                        authPassword: ''
                    } as Url;
                    this.testDialog = false;
                    this.testData = {
                        icon: 'success',
                        title: '',
                        name: '',
                        version: '',
                        luceneVersion: ''
                    }
                    this.dialog = false;
                }
            });
        },
        test() {
            let urlForm = this.$refs.urlForm as InstanceType<typeof ElForm>;
            urlForm.validate((valid) => {
                if (valid) {
                    httpStrategyContext.getStrategy().fetch<any>({
                        baseURL: this.url.value,
                        url: '/',
                        method: 'GET',
                        auth: this.url.isAuth ? {
                            username: this.url.authUser!,
                            password: this.url.authPassword!
                        } : undefined
                    }).then((response) => {
                        this.testDialog = true;
                        this.testData = {
                            icon: 'success',
                            title: '链接成功',
                            name: response.name,
                            version: response.version.number,
                            luceneVersion: response.version.lucene_version
                        }
                    }).catch((e) => {
                        console.error(e);
                        this.testDialog = true;
                        this.testData = {
                            icon: 'error',
                            title: '链接不可用',
                            name: '',
                            version: '',
                            luceneVersion: ''
                        }
                    });
                }
            })
        },
    }
});
</script>
<style scoped>

</style>