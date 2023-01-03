<template>
    <el-timeline style="margin-top: 10px;">
        <el-timeline-item :timestamp="log.time" placement="top" v-for="log in data.log">
            <el-card shadow="hover">
                <template #header>
                    <div style="font-size: 24px;font-weight: bold;">{{ log.version }}</div>
                </template>
                <div class="entry">
                    <ol>
                        <template v-for="item in log.items">
                            <li v-if="typeof item === 'string'">{{ item }}</li>
                            <ol v-else>
                                <li v-for="i in item">
                                    <span v-html="i"></span>
                                </li>
                            </ol>
                        </template>
                    </ol>
                    <div v-if="log.remark">
                        <span v-if="typeof log.remark === 'string'" v-html="log.remark"></span>
                        <span v-else>
                                <span v-for="item in log.remark">
                                    <span v-if="item.type === 'string'">{{ item.value }}</span>
                                    <el-link v-else :href="item.addon" target="_blank">{{ item.value }}</el-link>
                                </span>
                            </span>
                    </div>
                </div>
            </el-card>
        </el-timeline-item>
    </el-timeline>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Constant from "@/global/Constant";

export default defineComponent({
    name: 'setting-update',
    data: () => ({
        data: Constant
    })
});
</script>
<style scoped>

</style>