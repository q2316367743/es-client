export interface EditorSetting {

  /**
   * 编辑器字体大小
   */
  fontSize: number;

  /**
   * 小地图是否展示
   */
  minimap: boolean;

  /**
   * Control the wrapping of the editor.
   * When `wordWrap` = "off", the lines will never wrap.
   * When `wordWrap` = "on", the lines will wrap at the viewport width.
   * When `wordWrap` = "wordWrapColumn", the lines will wrap at `wordWrapColumn`.
   * When `wordWrap` = "bounded", the lines will wrap at min(viewport width, wordWrapColumn).
   * Defaults to "off".
   */
  wordWrap: 'off' | 'on' | 'wordWrapColumn' | 'bounded';

  /**
   * 运行文字颜色
   */
  runColor: string;

}

export function getDefaultEditorSettingValue(): EditorSetting {
  return {
    fontSize: 14,
    minimap: false,
    wordWrap: 'on' as 'off' | 'on' | 'wordWrapColumn' | 'bounded',
    runColor: '#0d7d6c'
  }
}
