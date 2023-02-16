import {defineStore} from "pinia";
import EditorSetting from "@/domain/EditorSetting";
import Optional from "@/utils/Optional";
import {lodisStrategyContext} from "@/global/BeanFactory";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

const useEditorSettingStore = defineStore('editor-setting', {
    state: () => ({
        fontSize: 14,
        minimap: false,
        wordWrap: 'on'
    }),
    getters: {
        getFontSize: (state): number => Optional.ofNullable(state.fontSize).orElse(16),
        getMinimap: (state): boolean => Optional.ofNullable(state.minimap).orElse(false),
        getWordWrap: (state): 'off' | 'on' | 'wordWrapColumn' | 'bounded' => Optional.ofNullable(state.wordWrap).orElse("on")
    },
    actions: {
        async init(): Promise<void> {
            let newVar = await lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.EDITOR_SETTING);
            if (newVar && newVar !== '') {
                try {
                    let instance = JSON.parse(newVar);
                    this.fontSize = Optional.ofNullable(instance).map(e => e['fontSize']).orElse(16);
                    this.minimap = Optional.ofNullable(instance).map(e => e['minimap']).orElse(false);
                    this.wordWrap = Optional.ofNullable(instance).map(e => e['wordWrap']).orElse('on');
                }catch (e) {
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
            await lodisStrategyContext.getStrategy().set(LocalStorageKeyEnum.EDITOR_SETTING, JSON.stringify({
                fontSize: this.fontSize,
                minimap: this.minimap,
                wordWrap: this.wordWrap
            }));
            emitter.emit(MessageEventEnum.EDITOR_SETTING_UPDATE);
            return Promise.resolve();
        }
    }
});

export default useEditorSettingStore;