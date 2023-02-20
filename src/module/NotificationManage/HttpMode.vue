<template>
    <div class="notification-body">
        <a-descriptions bordered :column="1">
            <a-descriptions-item label="请求域">
                <a-link>{{ httpMode.baseURL }}</a-link>
            </a-descriptions-item>
            <a-descriptions-item label="请求链接">
                <a-link>{{ httpMode.url }}</a-link>
            </a-descriptions-item>
            <a-descriptions-item label="请求方法">
                <a-tag color="blue">{{ httpMode.method }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="请求体" v-if="httpMode.method !== 'GET'">
                <a-button type="primary" size="mini" @click="showData = true">查看</a-button>
            </a-descriptions-item>
            <a-descriptions-item label="响应体">
                <a-button type="primary" size="mini" @click="showRsp = true">查看</a-button>
            </a-descriptions-item>
        </a-descriptions>
        <json-dialog v-model:value="showData" :json="httpMode.data" title="请求体"/>
        <json-dialog v-model:value="showRsp" :json="httpMode.rsp" title="响应体"/>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import JsonView from "@/components/JsonView/index.vue";
import {HttpMode} from "@/domain/NotificationItem";
import JsonDialog from "@/components/JsonDialog.vue";

export default defineComponent({
    name: 'notification-item-http',
    components: {JsonDialog, JsonView},
    props: {
        data: Object as PropType<HttpMode>
    },
    data: () => ({
        httpMode: {} as HttpMode,
        showData: false,
        showRsp: false
    }),
    created() {
        if (this.data) {
            this.httpMode = this.data;
        }
    }
});
</script>
<style scoped>

</style>