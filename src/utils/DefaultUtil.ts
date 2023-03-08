import EditorSetting from "@/domain/EditorSetting";
import Setting from "@/domain/Setting";
import PageNameEnum from "@/enumeration/PageNameEnum";
import TabCloseModeEnum from "@/enumeration/TabCloseModeEnum";
import TableHeaderModeEnum from "@/enumeration/TableHeaderModeEnum";
import TabLoadModeEnum from "@/enumeration/TabLoadModeEnum";

export default {
    getDefaultSettingValue(): Setting {
        return {

            // 布局设置
            defaultPage: PageNameEnum.HOME,

            // 新建索引
            defaultReplica: 1,
            defaultShard: 5,

            // http设置
            timeout: 5000,
            notificationTime: 5000,

            // 全局索引查询条件
            homeSearchState: 0,
            homeExcludeIndices: new Array<string>(),

            // 显示设置
            pageSize: 20,
            defaultViewer: 2,
            jsonFontSize: 16,
            jsonThemeByLight: 'github',
            jsonThemeByDark: 'github-dark',
            tableHeaderMode: TableHeaderModeEnum.RENDER,

            // 标签栏设置
            showTab: false,
            tabLoadMode: TabLoadModeEnum.APPEND,
            tabMaxCount: 10,
            tabCloseMode: TabCloseModeEnum.ALERT,

            // 其他设置
            autoFullScreen: false,
            lastUrl: false
        };
    },
    getDefaultEditorSettingValue(): EditorSetting {
        return {
            fontSize: 14,
            minimap: false,
            wordWrap: 'on' as 'off' | 'on' | 'wordWrapColumn' | 'bounded',
            runColor: '#0d7d6c'
        }
    }
}