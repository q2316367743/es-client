<template>
    <a-modal :title="$t('common.operation.add')" v-model:visible="dialog" width="600px" draggable
             :close-on-click-modal="false" destroy-on-close>
        <a-form :model="url" label-width="100px" ref="urlForm">
            <a-form-item :label="$t('common.keyword.name')" prop="name">
                <a-input v-model="url.name"></a-input>
            </a-form-item>
            <a-form-item :label="$t('common.keyword.url')" prop="value">
                <a-input v-model="url.value" :placeholder="$t('setting.link.placeholder.url')">
                </a-input>
            </a-form-item>
            <a-form-item :label="$t('setting.link.form.sequence')" prop="sequence">
                <a-input-number v-model="url.sequence" controls-position="right" size="large"/>
            </a-form-item>
            <a-form-item :label="$t('setting.link.form.isAuth')" prop="isAuth">
                <a-switch v-model="url.isAuth" active-text="true" inactive-text="false"/>
            </a-form-item>
            <a-form-item :label="$t('setting.link.form.authUser')" prop="authUser" v-if="url.isAuth">
                <a-input v-model="url.authUser" size="large"/>
            </a-form-item>
            <a-form-item :label="$t('setting.link.form.authPassword')" prop="authPassword" v-if="url.isAuth">
                <a-input v-model="url.authPassword" size="large"/>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-trigger position="top" trigger="click" content-class="save-or-update-url-content" :popup-offset="10">
                <a-button @click="test">{{ $t('common.operation.test') }}</a-button>
                <template #content>
                    <a-spin :loading="loading">
                        <a-result :status="testData.icon" :title="testData.title">
                            <template #subtitle> {{ testData.name }}</template>
                            <template #extra>
                                <div v-if="testData.icon === 'success'">elasticsearch版本：{{ testData.version }}</div>
                                <div v-if="testData.icon === 'success'" class="save-or-update-url-content-lucene">
                                    lucene版本：{{ testData.luceneVersion }}
                                </div>
                            </template>
                        </a-result>
                    </a-spin>
                </template>
            </a-trigger>
            <a-button type="primary" @click="submit">
                {{ isSave ? $t('common.operation.add') : $t('common.operation.update') }}
            </a-button>
        </template>
    </a-modal>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import Url from '@/entity/Url';

import {httpStrategyContext, urlService, useUrlEditEvent} from '@/global/BeanFactory';
import useUrlStore from '@/store/UrlStore';
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'SaveOrUpdateUrl',
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
        loading: false,
        testData: {
            icon: 'info',
            title: '',
            name: '',
            version: '',
            luceneVersion: ''
        }
    }),
    created() {
        useUrlEditEvent.on(url => {
            this.dialog = true;
            if (url) {
                this.isSave = false;
                this.url = url;
            } else {
                this.isSave = true;
                this.url = {
                    name: '',
                    value: 'http://',
                    sequence: 0,
                    isAuth: false,
                    authUser: '',
                    authPassword: ''
                } as Url;
            }
        })
    },
    methods: {
        submit() {
            this.loading = true;
            if (this.isSave) {
                // 新增
                urlService.insert({
                    name: this.url.name,
                    value: this.url.value,
                    sequence: this.url.sequence,
                    isAuth: this.url.isAuth,
                    authUser: this.url.authUser,
                    authPassword: this.url.authPassword
                }).then(() => MessageUtil.success('新增成功', useUrlStore().reset))
                    .catch(e => MessageUtil.error('新增失败', e))
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                // 更新
                urlService.updateById(this.url.id!, {
                    name: this.url.name,
                    value: this.url.value,
                    sequence: this.url.sequence,
                    createTime: this.url.createTime || new Date(),
                    isAuth: this.url.isAuth,
                    authUser: this.url.authUser,
                    authPassword: this.url.authPassword
                    // eslint-disable-next-line
                })
                    .then(() => MessageUtil.success('修改成功', useUrlStore().reset))
                    .catch(e => MessageUtil.error('修改失败', e))
                    .finally(() => {
                        this.loading = false;
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
            this.testData = {
                icon: 'success',
                title: '',
                name: '',
                version: '',
                luceneVersion: ''
            }
            this.dialog = false;
        },
        test() {
            this.loading = true;
            this.testData = {
                icon: 'info',
                title: '',
                name: '',
                version: '',
                luceneVersion: ''
            };
            httpStrategyContext.getStrategy().fetch<any>({
                baseURL: this.url.value,
                url: '/',
                method: 'GET',
                auth: this.url.isAuth ? {
                    username: this.url.authUser!,
                    password: this.url.authPassword!
                } : undefined
            }).then((response) => {
                this.testData = {
                    icon: 'success',
                    title: '链接成功',
                    name: response.name,
                    version: response.version.number,
                    luceneVersion: response.version.lucene_version
                }
            }).catch(() => {
                this.testData = {
                    icon: 'error',
                    title: '链接不可用',
                    name: '',
                    version: '',
                    luceneVersion: ''
                }
            }).finally(() => {
                this.loading = false;
            });
        },
    }
});
</script>
<style lang="less">
.save-or-update-url-content {
    background-color: var(--bg-color);
    border-radius: 20%;
    box-shadow: 0 0 6px var(--shadow-color);

    .save-or-update-url-content-lucene {
        margin-top: 10px;
    }
}
</style>