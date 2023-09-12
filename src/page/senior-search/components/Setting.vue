<template>
    <a-form :model="instance" layout="vertical">
        <a-form-item label="字体大小">
            <a-input-number v-model="instance.fontSize" :min="8" :max="100" :step="1" style="width: 100px"/>
        </a-form-item>
        <a-form-item label="显示小地图">
            <a-switch v-model="instance.minimap" :checked-value="true" :unchecked-value="false" type="round">
                <template #checked>显示</template>
                <template #unchecked>隐藏</template>
            </a-switch>
        </a-form-item>
        <a-form-item label="换行">
            <a-select v-model="instance.wordWrap" style="width: 200px">
                <a-option label="启用" value="on"/>
                <a-option label="禁用" value="off"/>
                <a-option label="单词处换行" value="wordWrapColumn"/>
                <a-option label="最小值换行" value="bounded"/>
            </a-select>
        </a-form-item>
        <a-form-item label="运行 - 字体颜色">
            <a-input v-model="instance.runColor" placeholder="颜色，十六进制"/>
        </a-form-item>
        <div style="text-align: right;margin-top: 18px">
            <a-button @click="close">取消</a-button>
            <a-button @click="save" type="primary">保存</a-button>
        </div>
    </a-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import useEditorSettingStore from "@/store/setting/EditorSettingStore";
import MessageUtil from "@/utils/MessageUtil";
import DefaultUtil from "@/utils/DefaultUtil";
import {getDefaultEditorSettingValue} from "@/domain/EditorSetting";

export default defineComponent({
    name: 'senior-search-setting',
    data: () => ({
        instance: getDefaultEditorSettingValue()
    }),
    created() {
        this.instance = useEditorSettingStore().getSetting
    },
    methods: {
        close() {
            this.$emit('close');
        },
        save() {
            useEditorSettingStore().save(this.instance).then(() => {
                MessageUtil.success('保存成功');
                this.close()
            });
        }
    }
});
</script>
<style scoped>

</style>
