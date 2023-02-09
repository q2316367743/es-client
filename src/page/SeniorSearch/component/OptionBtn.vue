<template>
    <el-tooltip :content="tooltip" placement="right"
                :effect="isDark ? 'dark' : 'light'">
        <el-icon :size="16" :class="className" @click="click">
            <slot/>
        </el-icon>
    </el-tooltip>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {isDark} from "@/global/BeanFactory";

export default defineComponent({
    name: 'ss-option-btn',
    props: {
        tooltip: String,
        className: String
    },
    data: () => ({
        isDark
    }),
    methods: {
        click(e: any) {
            this.$emit('click', e);
        }
    }
});
</script>
<style scoped>

</style>