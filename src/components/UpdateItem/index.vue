<template>
    <ol>
        <template v-for="item in log?.items">
            <li v-if="typeof item === 'string'">{{ item }}</li>
            <ol v-else-if="item instanceof Array">
                <li v-for="i in item">
                    <span v-html="i"></span>
                </li>
            </ol>
            <li v-else>
                <el-tag :type="renderTag(item.label).type" style="margin-left:5px;">{{
                        renderTag(item.label).name
                    }}
                </el-tag>
                <span style="margin-left:5px;">{{ item.content }}</span>
            </li>
        </template>
    </ol>
    <div v-if="log?.doc">
        更多详细的更新信息与功能变化，请在
        <el-link target="_blank" @click="open(log?.doc)">语雀</el-link>
        中查看
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {Log, LogItemEnum} from "@/view/Data";
import {nativeStrategyContext} from "@/global/BeanFactory";

export default defineComponent({
    name: 'update-item',
    props: {
        log: Object as PropType<Log>
    },
    methods: {
        renderTag(value: number): { name: string, type: string } {
            switch (value) {
                case LogItemEnum.ADD:
                    return {
                        name: '新增',
                        type: ''
                    };
                case LogItemEnum.UPDATE:
                    return {
                        name: '更新',
                        type: 'success'
                    };
                case LogItemEnum.REPAIR:
                    return {
                        name: '修复',
                        type: 'danger'
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
        },
        open(url: string) {
            nativeStrategyContext.getStrategy().openLink(url);
        }
    }
});
</script>
<style scoped>

</style>