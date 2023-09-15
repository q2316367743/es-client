<template>
    <a-tooltip content="编辑器设置" position="right">
        <a-button type="text" status="normal" @click="settingDialog = true">
            <template #icon>
                <icon-settings :size="18" />
            </template>
        </a-button>
    </a-tooltip>
    <a-modal v-model:visible="settingDialog" title="编辑器设置" draggable unmount-on-close render-to-body
             width="600px"
             :footer="false">
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
    </a-modal>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import useEditorSettingStore from "@/store/setting/EditorSettingStore";
import MessageUtil from "@/utils/MessageUtil";


const settingDialog = ref(false);
const instance = ref(useEditorSettingStore().getSetting);


function save() {
    useEditorSettingStore().save(instance.value).then(() => {
        MessageUtil.success('保存成功');
        settingDialog.value = false;
    });
}

</script>
<style scoped>

</style>
