import { defineStore } from "pinia";
import {EditorSetting, getDefaultEditorSettingValue} from "@/domain/EditorSetting";
import Optional from "@/utils/Optional";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const useEditorSettingStore = defineStore('editor-setting', {
    state: () => ({
        instance: getDefaultEditorSettingValue(),
        rev: undefined as undefined | string
    }),
    getters: {
        getSetting: (state): EditorSetting => state.instance,
        getFontSize: (state): number => Optional.ofNullable(state.instance.fontSize).orElse(16),
        getMinimap: (state): boolean => Optional.ofNullable(state.instance.minimap).orElse(false),
        getWordWrap: (state): 'off' | 'on' | 'wordWrapColumn' | 'bounded' => Optional.ofNullable(state.instance.wordWrap).orElse("on"),
        getRunColor: (state): string => Optional.ofNullable(state.instance.runColor).orElse("#0d7d6c"),
    },
    actions: {
        async init(): Promise<void> {
            let instance = await getFromOneByAsync<EditorSetting>(LocalNameEnum.SETTING_EDITOR, getDefaultEditorSettingValue());
            if (instance) {
                try {
                    Object.assign(this.instance, instance);
                } catch (e) {
                    console.error(e);
                }
            }
            return Promise.resolve();
        },
        async save(editorSetting: EditorSetting): Promise<void> {
            this.instance.fontSize = editorSetting.fontSize;
            this.instance.minimap = editorSetting.minimap;
            this.instance.wordWrap = editorSetting.wordWrap;
            this.instance.runColor = editorSetting.runColor;
            // 保存
            await saveOneByAsync(LocalNameEnum.SETTING_EDITOR, {
                fontSize: this.instance.fontSize,
                minimap: this.instance.minimap,
                wordWrap: this.instance.wordWrap,
                runColor: this.instance.runColor
            });
            return Promise.resolve();
        }
    }
});

export default useEditorSettingStore;
