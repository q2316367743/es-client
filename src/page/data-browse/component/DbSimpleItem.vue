<template>
    <a-tooltip :content="tip" placement="bottom">
        <div class="item" :class="disable ? 'disable' : ''" @click="click">
            <slot/>
        </div>
    </a-tooltip>
</template>
<script lang="ts">
import {defineComponent} from "vue";

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
    }),
    methods: {
        click() {
            if (!this.disable) {
                this.$emit('click')
            }
        }
    }
});
</script>
<style scoped>

</style>
