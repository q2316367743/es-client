<template>
    <el-drawer v-model="dialog" size="1000px" title="历史记录" append-to-body destroy-on-close>
        <div class="bsh-manage">
            <el-tabs v-model="active" class="history-manage-tabs">
                <el-tab-pane label="临时" name="temp"></el-tab-pane>
                <el-tab-pane label="历史" name="history"></el-tab-pane>
            </el-tabs>
            <div class="bsh-manage-body">
                <!-- 临时记录 -->
                <bsh-temp-record @load="load" v-show="active === 'temp'" />
                <!-- 历史记录 -->
                <bsh-history @load="load" v-show="active === 'history'"/>
            </div>
        </div>
    </el-drawer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import BaseSearchHistory from "@/entity/BaseSearchHistory";
import {useBaseSearchEvent} from "@/global/BeanFactory";
import BshTempRecord from "@/page/BaseSearch/History/TempRecord.vue";
import BshHistory from "@/page/BaseSearch/History/History.vue";


export default defineComponent({
    name: 'bsh-manage',
    components: {BshHistory, BshTempRecord},
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
        load() {
            this.dialog = false;
        }
    }
});
</script>
<style scoped lang="less">
.bsh-manage {
    position: absolute;
    top: 80px;
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