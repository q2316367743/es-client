<template>
    <div class="notification-manage">
        <a-card v-for="item in items" :key="item.id" class="notification-item">
            <template #title>{{ item.title }}</template>
            <template #extra> {{ format(item.time) }}</template>
            <notification-item-http v-if="item.type === 'http'" :data="item.httpMode"/>
        </a-card>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import useNotificationStore from "@/store/NotificationStore";
import XEUtils from "xe-utils";
import JsonView from "@/components/JsonView/index.vue";
import NotificationItemHttp from "@/module/NotificationManage/HttpMode.vue";

export default defineComponent({
    name: 'notification-manage',
    components: {NotificationItemHttp, JsonView},
    data: () => ({}),
    computed: {
        ...mapState(useNotificationStore, {
            items: (state) => {
                return state.items.sort((a, b) => b.id - a.id);
            }
        })
    },
    methods: {
        format(date: Date) {
            return XEUtils.toDateString(date, 'yyyy-MM-dd HH:ss:mm');
        }
    }
});
</script>
<style lang="less">
.notification-manage {
    height: 100%;

    .notification-item {
        margin-top: 8px;

        .notification-body {
            overflow: auto;

            .notification-body-item {
                white-space: nowrap;
            }

            .notification-body-extra {
                display: flex;
                justify-content: space-between;
            }
        }
    }
}
</style>