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
                <a-tag :color="renderTag(item.label).color" style="margin-left:5px;">{{
                    renderTag(item.label).name
                }}
                </a-tag>
                <span style="margin-left:5px;">{{ item.content }}</span>
                <span v-if="item.txc"><a-link @click="open(item.txc)">@兔小巢</a-link></span>
                <span v-if="item.gitee"><a-link @click="open(item.gitee?.content)">#{{ item.gitee?.title }}</a-link></span>
                <span v-if="item.pull">
                    <a-tooltip content="贡献者">
                        <a-link status="success" @click="open(item.pull?.url)">@ {{ item.pull?.name }}</a-link>
                    </a-tooltip>
                </span>
            </li>
        </template>
    </ol>
    <div v-if="log?.doc">
        更多详细的更新信息与功能变化，请在
        <a-link target="_blank" @click="open(log?.doc)">此处</a-link>
        中查看
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Log, LogItemEnum } from "@/view/Data";

export default defineComponent({
    name: 'update-item',
    props: {
        log: Object as PropType<Log>
    },
    methods: {
        renderTag(value: number): { name: string, color: string } {
            switch (value) {
                case LogItemEnum.ADD:
                    return {
                        name: '新增',
                        color: 'blue'
                    };
                case LogItemEnum.UPDATE:
                    return {
                        name: '更新',
                        color: 'green'
                    };
                case LogItemEnum.REPAIR:
                    return {
                        name: '修复',
                        color: 'red'
                    };
                case LogItemEnum.OPTIMIZATION:
                    return {
                        name: '优化',
                        color: 'orange'
                    };
                default:
                    return {
                        name: '',
                        color: ''
                    };
            }
        },
        open(url?: string) {
            if (url) {
                utools.shellOpenExternal(url);
            }
        }
    }
});
</script>
<style scoped></style>