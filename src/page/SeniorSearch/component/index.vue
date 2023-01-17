<template>
    <el-drawer v-model="dialog" size="1000px" title="历史记录" append-to-body destroy-on-close>
        <div class="history-manage">
            <el-tabs v-model="active" class="history-manage-tabs">
                <el-tab-pane label="临时" name="temp"></el-tab-pane>
                <el-tab-pane label="历史" name="history"></el-tab-pane>
            </el-tabs>
            <div class="history-manage-body">
                <!-- 临时记录 -->
                <hm-temp-record @load="load" v-show="active === 'temp'"/>
                <!-- 历史记录 -->
                <hm-history @load="load" v-show="active === 'history'"/>
            </div>
        </div>
    </el-drawer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import HmTempRecord from "@/page/SeniorSearch/component/TempRecord.vue";
import HmHistory from "@/page/SeniorSearch/component/History.vue";
import {useSeniorSearchEvent} from "@/global/BeanFactory";


export default defineComponent({
    name: 'senior-search-history-manage',
    components: {HmHistory, HmTempRecord},
    emits: ['update:modelValue'],
    props: {
        modelValue: Boolean
    },
    data: () => ({
        active: 'temp',
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
                link: history.link,
                method: history.method,
                params: history.params,
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