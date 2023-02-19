<template>
    <div class="notification-body">
        <p class="notification-body-item" v-if="httpMode.baseURL">请求域：{{ httpMode.baseURL }}</p>
        <p class="notification-body-item">请求链接：{{ httpMode.url }}</p>
        <p class="notification-body-item">请求方法：{{ httpMode.method }}</p>
        <div v-if="httpMode.method !== 'GET'">
            <div class="notification-body-extra">
                <div>请求体：</div>
                <a-button type="text" @click="showData = true">查看</a-button>
            </div>
            <json-dialog v-model:value="showData" :json="httpMode.data" title="请求体"/>
        </div>
        <div>
            <div class="notification-body-extra">
                <div>响应体：</div>
                <a-button type="text" @click="showRsp = true">查看</a-button>
            </div>
            <json-dialog v-model:value="showRsp" :json="httpMode.rsp" title="响应体"/>
        </div>
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