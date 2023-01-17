<template>
    <el-timeline style="margin-top: 10px;">
        <el-timeline-item :timestamp="log.time" placement="top" v-for="log in data.logs">
            <el-card shadow="hover">
                <template #header>
                    <div style="font-size: 24px;font-weight: bold;">{{ log.version }}</div>
                </template>
                <div class="entry">
                    <update-item :log="log"/>
                </div>
            </el-card>
        </el-timeline-item>
    </el-timeline>
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