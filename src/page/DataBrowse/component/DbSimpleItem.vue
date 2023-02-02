<template>
    <el-tooltip :content="tip" placement="bottom" :effect="isDark ? 'dark' : 'light'">
        <div class="item" :class="disable ? 'disable' : ''" @click="click">
            <slot/>
        </div>
    </el-tooltip>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {isDark} from '@/global/BeanFactory';

export default defineComponent({
    name: 'db-simple-item',
    emits: ['click'],
    props: {
        disable: {
            type: Boolean,
            required: false,
            default: false
        },
        tip: {
            type: String,
            required: false,
            default: ""
        }
    },
    data: () => ({
        isDark
    }),
    methods: {
        click() {
            if (this.disable === false) {
                this.$emit('click')
            }
        }
    }
});
</script>
<style scoped>

</style>