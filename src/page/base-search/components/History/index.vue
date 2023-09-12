<template>
    <a-button type="primary" status="warning" @click="dialog= true" title="历史">
        <template #icon>
            <icon-history/>
        </template>
    </a-button>
    <a-drawer v-model:visible="dialog" width="60%" title="历史记录" render-to-body unmount-on-close :footer="false"
              popup-container="#main">
        <bsh-history @load="load"/>
    </a-drawer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import BshHistory from "./History.vue";


export default defineComponent({
    name: 'bsh-manage',
    components: {BshHistory},
    emits: ['update:modelValue'],
    data: () => ({
        dialog: false
    }),
    methods: {
        load() {
            this.dialog = false;
        }
    }
});
</script>
<style scoped lang="less">
.bsh-manage {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;

    .bsh-manage-body {
        position: absolute;
        top: 54px;
        left: 0;
        right: 0;
        bottom: 0;

    }
}
</style>
