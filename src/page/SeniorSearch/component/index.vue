<template>
    <el-drawer v-model="dialog" size="60%" title="历史记录" append-to-body destroy-on-close>
        <el-scrollbar>
            <hm-history @load="load"/>
        </el-scrollbar>
    </el-drawer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import HmHistory from "@/page/SeniorSearch/component/History.vue";
import {useSeniorSearchEvent} from "@/global/BeanFactory";


export default defineComponent({
    name: 'senior-search-history-manage',
    components: {HmHistory},
    emits: ['update:modelValue'],
    props: {
        modelValue: Boolean
    },
    data: () => ({
        dialog: false
    }),
    watch: {
        modelValue(newValue: boolean) {
            this.dialog = newValue;
        },
        dialog(newValue: boolean) {
            this.$emit('update:modelValue', newValue);
        }
    },
    created() {
        if (this.modelValue === undefined) {
            this.dialog = this.modelValue;
        }
    },
    methods: {
        load(history: SeniorSearchHistory) {
            useSeniorSearchEvent.emit({
                id: history.id,
                name: history.name,
                body: history.body,
                execute: false
            });
            this.dialog = false;
        }
    }
});
</script>
<style scoped lang="less">
.history-manage {
    position: absolute;
    top: 80px;
    left: 20px;
    right: 20px;
    bottom: 20px;

    .history-manage-body {
        position: absolute;
        top: 54px;
        left: 0;
        right: 0;
        bottom: 0;

    }
}
</style>