<template>
    <a-card class="dashboard-card">
        <template #title>
            <span>{{ props.title }}</span>
            <a-button type="text" size="large" @click="emits('render')">
                <template #icon>
                    <icon-refresh/>
                </template>
            </a-button>
        </template>
        <template #extra>
            <icon-refresh spin v-if="props.loading"/>
            <span style="margin-left: 7px" v-if="props.loading">加载中</span>
        </template>
        <slot name="default"/>
    </a-card>
</template>
<script lang="ts" setup>
const props = defineProps({
    title: {
        type: String,
        required: false,
        default: ""
    },
    loading: Boolean
});
const emits = defineEmits(['render']);
</script>
<style scoped lang="less">
.dashboard-card {
    margin: 2px;


    &:first-child {
        margin-top: 4px;
        margin-left: 4px;
    }

    &:last-child {
        margin-right: 4px;
        margin-bottom: 4px;
    }
}
</style>
