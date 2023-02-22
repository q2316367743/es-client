import { defineStore } from "pinia";
import EditorSetting from "@/domain/EditorSetting";
import Optional from "@/utils/Optional";
import { lodisStrategyContext } from "@/global/BeanFactory";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import DefaultUtil from "@/utils/DefaultUtil";

const useEditorSettingStore = defineStore('editor-setting', {
    state: DefaultUtil.getDefaultEditorSettingValue,
    getters: {
        getFontSize: (state): number => Optional.ofNullable(state.fontSize).orElse(16),
        getMinimap: (state): boolean => Optional.ofNullable(state.minimap).orElse(false),
        getWordWrap: (state): 'off' | 'on' | 'wordWrapColumn' | 'bounded' => Optional.ofNullable(state.wordWrap).orElse("on")
    },
    actions: {
        async init(): Promise<void> {
            let instance = await lodisStrategyContext.getStrategy().get<EditorSetting>(LocalStorageKeyEnum.EDITOR_SETTING);
            if (instance) {
                try {
                    this.fontSize = Optional.ofNullable(instance).attr('fontSize').orElse(16);
                    this.minimap = Optional.ofNullable(instance).attr('minimap').orElse(false);
                    this.wordWrap = Optional.ofNullable(instance).attr('wordWrap').orElse('on');
                } catch (e) {
                    console.error(e);
                }
            }
            return Promise.resolve();
        },
        async save(editorSetting: EditorSetting): Promise<void> {
            this.fontSize = editorSetting.fontSize;
            this.minimap = editorSetting.minimap;
            this.wordWrap = editorSetting.wordWrap;
            // 保存
            await lodisStrategyContext.getStrategy().set<EditorSetting>(LocalStorageKeyEnum.EDITOR_SETTING, {
                fontSize: this.fontSize,
                minimap: this.minimap,
                wordWrap: this.wordWrap
            });
            emitter.emit(MessageEventEnum.EDITOR_SETTING_UPDATE);
            return Promise.resolve();
        }
    }
});

export default useEditorSettingStore;