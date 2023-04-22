<template>
    <div class="setting-url">
        <div class="setting-url-toolbar">
            <a-button type="primary" @click="editOpen(undefined)">{{ $t('common.operation.add') }}</a-button>
            <div></div>
            <a-input v-model="condition.name" :placeholder="$t('common.keyword.name')" allow-clear />
        </div>
        <a-table ref="urlTable" :data="showUrls" class="data" sticky-header style="height: 100%;">
            <template #columns>
                <a-table-column data-index="name" :title="$t('common.keyword.name')" :width="180"
                    fixed="left"></a-table-column>
                <a-table-column data-index="value" :title="$t('common.keyword.url')">
                    <template #cell="{ record }">
                        <a-link @click="open(record.value)" type="primary" target="_blank">{{ record.value }}</a-link>
                        <div class="url-copy" @click="execCopy(record.value)">{{ $t('common.operation.copy') }}</div>
                    </template>
                </a-table-column>
                <a-table-column data-index="version" title="版本" :width="180" />
                <a-table-column :title="$t('setting.link.form.updateTime')" :width="200">
                    <template #cell="{ record }">
                        {{ prettyDate(record.updateTime) }}
                    </template>
                </a-table-column>
                <a-table-column :title="$t('setting.link.form.isAuth')" :width="120">
                    <template #cell="{ record }">
                        {{ prettyAuth(record.isAuth) }}
                    </template>
                </a-table-column>
                <a-table-column data-index="authUser" :title="$t('setting.link.form.authUser')" :width="120" />
                <a-table-column data-index="authPassword" :title="$t('setting.link.form.authPassword')" :width="120" />
                <a-table-column :title="$t('common.keyword.operation')" :width="160" fixed="right">
                    <template #cell="{ record }">
                        <a-button type="primary" size="small" @click="editOpen(record)">{{ $t('common.operation.edit') }}
                        </a-button>
                        <a-button type="primary" status="danger" size="small" @click="remove(record.id, record.value)"
                            style="margin-left: 8px;">
                            {{ $t('common.operation.delete') }}
                        </a-button>
                    </template>
                </a-table-column>
            </template>
        </a-table>
    </div>
</template>
<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { mapState } from "pinia";
import { toDateString } from "xe-utils";

import useUrlStore from "@/store/UrlStore";
import useIndexStore from "@/store/IndexStore";
import Url from "@/entity/Url";

// 组件
import JsonDialog from "@/components/JsonDialog.vue";

import { nativeStrategyContext, urlService, useUrlEditEvent } from "@/global/BeanFactory";
import BrowserUtil from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import UrlAuthTypeEnum from "@/enumeration/UrlAuthTypeEnum";

export default defineComponent({
    name: 'setting-url',
    components: { JsonDialog },
    data: () => ({
        condition: {
            name: '',
            url: ''
        },
        url: {
            name: '',
            value: 'http://',
            sequence: 0,
            isAuth: false,
            authType: UrlAuthTypeEnum.BASIC,
            authUser: '',
            authPassword: '',
            version: ''
        } as Url,
    }),
    computed: {
        ...mapState(useUrlStore, ['urls']),
        showUrls() {
            return this.urls.filter(url => this.condition.name === '' || (url.name && url.name.indexOf(this.condition.name) > -1))
        }
    },
    methods: {
        prettyDate(params: Date) {
            return toDateString(params, "yyyy-MM-dd HH:mm:ss");
        },
        prettyAuth(params: boolean) {
            return params ? this.$t('setting.link.form.needAuth') : this.$t('setting.link.form.notAuth');
        },
        remove(id: number, value: string) {
            MessageBoxUtil.confirm('是否删除相关的搜索历史', '提示', {
                confirmButtonText: '删除全部',
                cancelButtonText: '只删除链接'
            }).then(() => {
                this.execRemove(id, true)
                    .then(() => this.removeAfter(value))
                    .catch(e => MessageUtil.error('删除失败', e));
            }).catch((action) => {
                if (action === 'cancel') {
                    this.execRemove(id, false)
                        .then(() => this.removeAfter(value))
                        .catch(e => MessageUtil.error('删除失败', e));
                }
            })
        },
        execRemove(id: number, removeAll: boolean): Promise<void> {
            if (removeAll) {
                return urlService.deleteAllById(id);
            } else {
                return urlService.deleteById(id);
            }
        },
        removeAfter(value: string) {
            MessageUtil.success('删除成功');
            if (useUrlStore().current === value) {
                // 删除了当前索引
                useUrlStore().clear();
                useIndexStore().clear();
            }
            useUrlStore().reset();
            useIndexStore().reset();
        },
        editOpen(url?: Url) {
            if (url) {
                useUrlEditEvent.emit(JSON.parse(JSON.stringify(toRaw(url))));
            } else {
                useUrlEditEvent.emit();
            }
        },
        execCopy: BrowserUtil.copy,
        open(url: string) {
            nativeStrategyContext.getStrategy().openLink(url);
        }
    }
});
</script>
<style lang="less">
.setting-url {
    .setting-url-toolbar {
        display: grid;
        grid-template-columns: 60px 1fr 300px;
        margin: 8px 5px;
    }

    .url-copy {
        display: inline;
    }
}
</style>