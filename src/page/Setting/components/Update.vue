<template>
    <a-timeline style="margin-top: 10px;" label-position="relative">
        <a-timeline-item :label="log.time" placement="top" v-for="log in data.logs">
            <a-card shadow="hover" :title="log.version">
                <div class="entry">
                    <update-item :log="log"/>
                </div>
            </a-card>
        </a-timeline-item>
    </a-timeline>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Constant from "@/global/Constant";
import {LogItemEnum} from "@/view/Data";
import UpdateItem from "@/components/UpdateItem/index.vue";

export default defineComponent({
    name: 'setting-update',
    components: {UpdateItem},
    data: () => ({
        data: Constant,
    }),
    methods: {
        renderTag(value: number): { name: string, type: string } {
            switch (value) {
                case LogItemEnum.ADD:
                    return {
                        name: '新增',
                        type: 'primary'
                    };
                case LogItemEnum.UPDATE:
                    return {
                        name: '更新',
                        type: 'success'
                    };
                case LogItemEnum.REPAIR:
                    return {
                        name: '修复',
                        type: 'error'
                    };
                case LogItemEnum.OPTIMIZATION:
                    return {
                        name: '优化',
                        type: 'warning'
                    };
                default:
                    return {
                        name: '',
                        type: ''
                    };
            }
        }
    }
});
</script>
<style scoped>

</style>