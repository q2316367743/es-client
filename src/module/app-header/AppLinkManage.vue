<template>
    <a-trigger trigger="click" v-model:popup-visible="visible" :popup-offset="8" show-arrow position="bl">
        <a-button style="margin-top: 4px;">
            <a-space>
                <a-badge :count="10" dot :status="status"></a-badge>
                <span>{{ selectName }}</span>
                <icon-up v-if="visible"/>
                <icon-down v-else/>
            </a-space>
        </a-button>
        <template #content>
            <div class="app-link-manage" ref="contentRef">
                <div class="header">
                    <a-input v-model="keyword" placeholder="链接名称" allow-clear/>
                    <a-button type="primary" @click="toAddLink">新增</a-button>
                    <a-button type="primary" @click="toManage">编辑</a-button>
                </div>
                <a-list :max-height="maxHeight" style="margin-top: 8px;" hoverable>
                    <a-list-item v-for="item in urls" :key="item.id" class="clickable" @click="selectUrl(item.id)">
                        <a-list-item-meta :description="item.value">
                            <template #title>
                                <a-space>
                                    <span>{{ item.name }}</span>
                                    <a-tag v-if="item.id === selectUrlId" bordered color="green">当前</a-tag>
                                </a-space>
                            </template>
                        </a-list-item-meta>
                        <template #actions>
                            <a-tag bordered v-if="item.isAuth">需要认证</a-tag>
                            <a-tag bordered v-if="item.version" color="arcoblue">{{ item.version }}</a-tag>
                        </template>
                    </a-list-item>
                </a-list>
            </div>
        </template>
    </a-trigger>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {openAddLink} from "@/page/setting/pages/link/components/EditLink";
import {useElementSize} from "@vueuse/core";
import useUrlStore from "@/store/UrlStore";
import {useFuse} from "@vueuse/integrations/useFuse";
import useIndexStore from "@/store/IndexStore";
import {useRouter} from "vue-router";
import Assert from "@/utils/Assert";

const contentRef = ref();
const keyword = ref('');
const visible = ref(false);

const router = useRouter();
const size = useElementSize(contentRef);

const items = computed(() => useUrlStore().urls);
const {results} = useFuse(keyword, items, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name'
        }, {
            name: 'value'
        }]
    }
});
const urls = computed(() => results.value.map(e => e.item));

const maxHeight = computed(() => size.height.value - 40);
const selectName = computed(() => {
    const {id, urlMap} = useUrlStore();
    if (!id) {
        return '请选择链接';
    }
    const url = urlMap.get(id);
    return url?.name || '请选择链接';
});
const status = computed(() => {
    const status = useIndexStore().status;
    if (status === 'yellow') {
        return 'warning';
    } else if (status === 'green') {
        return 'success';
    } else if (status === 'red') {
        return 'danger';
    }
    return 'normal';
});
const selectUrlId = computed(() => {
    const {id} = useUrlStore();
    return id;
});

// -------------------------------------- 方法 --------------------------------------

const toManage = () => {
    router.push('/setting/link');
    // 关闭弹窗
    visible.value = false;
}

const toAddLink = () => {
    openAddLink();
    // 关闭弹窗
    visible.value = false;
}

async function selectUrl(value: number) {
    // 选择链接
    Assert.isTrue(useUrlStore().choose(value as number), "链接未找到");
    // 索引刷新
    await useIndexStore().reset();
    // 关闭弹窗
    visible.value = false;
}

</script>
<style scoped lang="less">
.app-link-manage {
    width: 50vw;
    max-width: 1200px;
    height: 340px;
    background-color: var(--color-bg-2);
    color: var(--color-text-1);
    border-radius: var(--border-radius-medium);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 8px;

    .header {
        display: grid;
        grid-template-columns: 1fr 60px 60px;
    }
}
</style>
