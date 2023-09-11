<template>
    <div class="setting-url">
        <div class="setting-url-toolbar">
            <a-button type="primary" @click="editOpen(undefined)">{{ $t('common.operation.add') }}</a-button>
            <div></div>
            <a-input v-model="condition.name" :placeholder="$t('common.keyword.name')" allow-clear/>
        </div>
        <a-table ref="urlTable" :data="showUrls" class="data" sticky-header style="height: 100%;">
            <template #columns>
                <a-table-column data-index="name" :title="$t('common.keyword.name')" :width="120"
                                fixed="left"></a-table-column>
                <a-table-column data-index="value" :title="$t('common.keyword.url')" :width="260">
                    <template #cell="{ record }">
                        <a-link @click="open(record.value)" type="primary" target="_blank">{{ record.value }}</a-link>
                        <div class="url-copy" @click="execCopy(record.value)">{{ $t('common.operation.copy') }}</div>
                    </template>
                </a-table-column>
                <a-table-column data-index="version" title="版本" :width="100"/>
                <a-table-column :title="$t('setting.link.form.isAuth')" :width="100">
                    <template #cell="{ record }">
                        {{ prettyAuth(record.isAuth) }}
                    </template>
                </a-table-column>
                <a-table-column :title="$t('common.keyword.operation')" :width="160" fixed="right">
                    <template #cell="{ record }">
                        <a-button type="primary" size="small" @click="editOpen(record)">{{
                                $t('common.operation.edit')
                            }}
                        </a-button>
                        <a-button type="primary" status="danger" size="small" @click="remove(record.id, record.value)"
                                  style="margin-left: 8px;">
                            {{ $t('common.operation.delete') }}
                        </a-button>
                    </template>
                </a-table-column>
            </template>
        </a-table>
        <save-or-update-url />
    </div>
</template>
<script lang="ts">
import {defineComponent, toRaw} from "vue";
import {mapState} from "pinia";

import useUrlStore from "@/store/UrlStore";
import useIndexStore from "@/store/IndexStore";
import Url from "@/entity/Url";

import { useUrlEditEvent} from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import UrlAuthTypeEnum from "@/enumeration/UrlAuthTypeEnum";
import SaveOrUpdateUrl from "@/page/setting/components/save-or-update-url/index.vue";

export default defineComponent({
    name: 'setting-url',
    components: {SaveOrUpdateUrl},
    data: () => ({
        UrlAuthTypeEnum,
        condition: {
            name: '',
            url: ''
        },
    }),
    computed: {
        ...mapState(useUrlStore, ['urls']),
        showUrls() {
            return this.urls.filter(url => this.condition.name === '' || (url.name && url.name.indexOf(this.condition.name) > -1))
        }
    },
    mounted() {
        if (this.$route.query.method) {
            useUrlEditEvent.emit();
        }
    },
    methods: {
        prettyAuth(params: boolean) {
            return params ? this.$t('setting.link.form.needAuth') : this.$t('setting.link.form.notAuth');
        },
        remove(id: number, value: string) {
            MessageBoxUtil.confirm('是否删除相关的搜索历史', '提示', {
                confirmButtonText: '删除全部',
                cancelButtonText: '只删除链接'
            }).then(() => {
                useUrlStore().remove(id)
                    .then(() => this.removeAfter(value))
                    .catch(e => MessageUtil.error('删除失败', e));
            })
        },
        removeAfter(value: string) {
            MessageUtil.success('删除成功');
            if (useUrlStore().current === value) {
                // 删除了当前索引
                useUrlStore().clear();
                useIndexStore().clear();
            }
            useIndexStore().reset();
        },
        editOpen(url?: Url) {
            if (url) {
                useUrlEditEvent.emit(JSON.parse(JSON.stringify(toRaw(url))));
            } else {
                useUrlEditEvent.emit();
            }
        },
        execCopy: utools.copyText,
        open(url: string) {
            utools.shellOpenExternal(url);
        },
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
