<template>
    <a-drawer v-model:visible="show" title="基础搜索设置" class="base-search-setting" :width="600" ok-text="保存" @ok="save">
        <a-form :model="setting" layout="vertical">
            <a-form-item label="默认查询参数">
                <codemirror v-model.trim="setting.defaultParams" placeholder="请在这里输入默认查询参数"
                            :style="{ height: '200px',width: '568px' }" :autofocus="true"
                            :indent-with-tab="true" :tabSize="4" :extensions="extensions"/>
                <template #help>
                    此处需要一个JSON字符串，可以覆盖下面的参数
                </template>
            </a-form-item>
            <a-form-item label="track_total_hits">
                <a-switch v-model="setting.enableTrackTotalHits"/>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {Codemirror} from 'vue-codemirror';
import {json} from '@codemirror/lang-json';
import {mapState} from "pinia";
import {getDefaultBaseSearchSetting, useBaseSearchSettingStore} from "@/store/setting/BaseSearchSetting";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'base-search-setting',
    components: {Codemirror},
    emits: ['update:visible'],
    props: {
        visible: Boolean
    },
    data: () => ({
        show: false,
        extensions: [json()] as Array<any>,
        setting: getDefaultBaseSearchSetting()
    }),
    computed: {
        ...mapState(useBaseSearchSettingStore, ['baseSearchSetting'])
    },
    watch: {
        visible(newValue) {
            this.show = newValue;
        },
        show(newValue) {
            this.$emit('update:visible', newValue);
        }
    },
    created() {
        this.setting = Object.assign(this.setting, this.baseSearchSetting);
    },
    methods: {
        save() {
            useBaseSearchSettingStore().save(this.setting)
                    .then(() => MessageUtil.success("保存成功"))
                    .catch(e => MessageUtil.error("保存失败", e));
        }
    }
});
</script>
<style scoped>

</style>
