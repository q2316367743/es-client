<template>
    <a-tooltip content="控制台">
        <a-button type="text" class="menu-item" @click="openDrawer()">
            <template #icon>
                <a-badge :count="hasNew ? 1 : 0" dot>
                    <icon-bug/>
                </a-badge>
            </template>
        </a-button>
    </a-tooltip>
    <a-drawer v-model:visible="visible" title="请求日志" unmount-on-close render-to-body mask-closable width="400px">
        <a-card v-for="record in records" :key="record.id" style="margin-bottom: 7px;">
            <template #title>
                <a-tag color="orange">{{ prettyDate(record.createTime) }}</a-tag>
            </template>
            <template #extra>
                <a-tag :color="record.code === 200? 'green' : 'red'">{{ record.code }}</a-tag>
            </template>
            <a-descriptions :column="1">
                <a-descriptions-item label="请求链接">
                    <a-link>{{ record.url }}</a-link>
                </a-descriptions-item>
                <a-descriptions-item label="请求方式">
                    <a-tag color="arcoblue">{{ record.method }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="异常消息" v-if="record.message !== ''">
                    <div>{{ record.message }}</div>
                </a-descriptions-item>
                <a-descriptions-item label="操作">
                    <a-button-group type="primary">
                        <a-button @click="openDialog('请求体', record.body)">显示请求体</a-button>
                        <a-button @click="openDialog('响应体', record.response)">显示响应体</a-button>
                    </a-button-group>
                </a-descriptions-item>
            </a-descriptions>
        </a-card>
        <template #footer>
            <a-tooltip content="控制台">
                <a-switch :model-value="vconsole != null" @change="switchVConsole()">
                    <template #checked>打开</template>
                    <template #unchecked>关闭</template>
                </a-switch>
            </a-tooltip>
            <a-button type="primary" status="danger" @click="clear()">清空</a-button>
        </template>
    </a-drawer>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useErrorStore} from "@/store/components/ErrorStore";
import {toDateString} from "xe-utils";
import VConsole from 'vconsole';
import {useGlobalStore} from "@/store/GlobalStore";
import {showJson} from "@/utils/DialogUtil";

const visible = ref(false);
// 信息弹框


const hasNew = computed(() => useErrorStore().hasNew);
const records = computed(() => useErrorStore().records);

let vconsole: VConsole | null;

watch(() => useGlobalStore().isDark, isDark => {
    if (vconsole) {
        vconsole.setOption({
            theme: isDark ? 'dark' : 'light'
        })
    }
});

function switchVConsole() {
    if (vconsole) {
        vconsole.destroy();
        vconsole = null;
    } else {
        vconsole = new VConsole({
            theme: useGlobalStore().isDark ? 'dark' : 'light'
        });
    }
}

const prettyDate = (date: Date) => toDateString(date, "yyyy-MM-dd HH:mm:ss");
const clear = () => useErrorStore().clear();

function openDrawer() {
    visible.value = true;
    useErrorStore().read();
}

function openDialog(title: string, data: any) {
    if (data === 'undefined' && title === '请求体') {
        data = '没有请求体';
    }
    showJson(title, data);
}


</script>
<style scoped>

</style>
