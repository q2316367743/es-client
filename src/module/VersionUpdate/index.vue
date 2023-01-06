<template>
    <div class="entry">
        <div>
            <span>恭喜你成功更新到 </span>
            <span style="color: var(--active-color)">{{ version }}</span>
        </div>
        <div>本次更新如下</div>
        <ol>
            <template v-for="item in log.items">
                <li v-if="typeof item === 'string'">{{ item }}</li>
                <ol v-else-if="item instanceof Array">
                    <li v-for="i in item">
                        <span v-html="i"></span>
                    </li>
                </ol>
                <li v-else>
                    <el-tag :type="renderTag(item.label).type" style="margin-left:5px;">{{ renderTag(item.label).name }}</el-tag>
                    <span style="margin-left:5px;">{{ item.content }}</span>
                </li>
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
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Constant from "@/global/Constant";
import {LogItemEnum} from "@/view/Data";

export default defineComponent({
    name: 'version-update',
    data: () => ({
        version: Constant.version,
        log: Constant.logs[0]
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