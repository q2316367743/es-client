import {defineStore} from "pinia";
import {EditorSetting, getDefaultEditorSettingValue} from "@/domain/EditorSetting";
import Optional from "@/utils/Optional";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const useEditorSettingStore = defineStore('editor-setting', {
  state: () => ({
    instance: getDefaultEditorSettingValue(),
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
      const res = await getFromOneByAsync<EditorSetting>(LocalNameEnum.SETTING_EDITOR, getDefaultEditorSettingValue());
      this.instance = res.record;
    },
    async save(editorSetting: EditorSetting): Promise<void> {
      this.instance = editorSetting;
      // 保存
      await saveOneByAsync(LocalNameEnum.SETTING_EDITOR, this.instance);
    }
  }
});

export default useEditorSettingStore;
