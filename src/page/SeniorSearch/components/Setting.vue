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
        <div style="text-align: right;margin-top: 18px">
            <a-button @click="close">取消</a-button>
            <a-button @click="save" type="primary">保存</a-button>
        </div>
    </a-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import useEditorSettingStore from "@/store/useEditorSettingStore";
import EditorSetting from "@/domain/EditorSetting";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'senior-search-setting',
    data: () => ({
        instance: {
            fontSize: 14,
            minimap: false,
            wordWrap: 'on'
        } as EditorSetting
    }),
    created() {
        this.instance.fontSize = useEditorSettingStore().getFontSize;
        this.instance.minimap = useEditorSettingStore().getMinimap;
        this.instance.wordWrap = useEditorSettingStore().getWordWrap;
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