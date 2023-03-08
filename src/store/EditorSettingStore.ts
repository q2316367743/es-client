import { defineStore } from "pinia";
import EditorSetting from "@/domain/EditorSetting";
import Optional from "@/utils/Optional";
import { lodisStrategyContext } from "@/global/BeanFactory";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import DefaultUtil from "@/utils/DefaultUtil";

const useEditorSettingStore = defineStore('editor-setting', {
    state: () => ({
        instance: DefaultUtil.getDefaultEditorSettingValue()
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
            let instance = await lodisStrategyContext.getStrategy().get<EditorSetting>(LocalStorageKeyEnum.EDITOR_SETTING);
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
            await lodisStrategyContext.getStrategy().set<EditorSetting>(LocalStorageKeyEnum.EDITOR_SETTING, {
                fontSize: this.instance.fontSize,
                minimap: this.instance.minimap,
                wordWrap: this.instance.wordWrap,
                runColor: this.instance.runColor
            });
            emitter.emit(MessageEventEnum.EDITOR_SETTING_UPDATE);
            return Promise.resolve();
        }
    }
});

export default useEditorSettingStore;