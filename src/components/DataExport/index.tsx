import ConditionExportEvent, {ExportConfig} from "@/components/DataExport/domain";
import {
    Drawer,
    Form,
    FormItem,
    Select,
    Option,
    Input,
    InputNumber,
    InputGroup,
    Radio,
    RadioGroup
} from "@arco-design/web-vue";
import {Ref, ref} from "vue";
import {ApiType, ExportMode, ExportScope, ExportSource, ExportType} from "@/components/ExportComponent/domain";

const allowExportTypes: Array<ExportType> = [ExportType.JSON];

/**
 * 显示导出组件
 * @param config 配置项
 */
export function showDataExportDrawer(config: ConditionExportEvent) {

    const instance: Ref<ExportConfig> = ref<ExportConfig>(getDefaultConfig(config));

    // 显示对话框
    Drawer.open({
        title: "数据导出",
        content: () => <Form model={instance} layout="vertical">
            <FormItem label="文件名">
                <Input v-model={instance.value.name}/>
            </FormItem>
            <FormItem label="文件类型">
                <Select v-model={instance.value.type}>
                    <Option value={ExportType.JSON}>JSON文件(*.json)</Option>
                    <Option value={ExportType.XLSX}>表格(*.xlsx)</Option>
                    <Option value={ExportType.CSV}>CSV(*.csv)</Option>
                    <Option value={ExportType.TSV}>管道分隔(*.txt)</Option>
                    <Option value={ExportType.TXT}>文本文件(*.txt)</Option>
                </Select>
            </FormItem>
            {isText(instance)}
            <FormItem label="导出范围">
                <Select v-model={instance.value.scope}>
                    <Option value={ExportScope.CURRENT}>当前页面</Option>
                    <Option value={ExportScope.ALL}>全部</Option>
                    <Option value={ExportScope.CUSTOM}>自定义范围</Option>
                </Select>
            </FormItem>
            {isCustom(instance)}
            {isCurrent(instance)}
            <FormItem label="来源">
                <Select v-model={instance.value.source}>
                    <Option value={ExportSource.ALL}
                            disabled={!allowExportTypes.includes(instance.value.type)}>全部
                    </Option>
                    <Option value={ExportSource.HIT}>只导出hits</Option>
                    <Option value={ExportSource.SOURCE}>只导出_source内容</Option>
                </Select>
            </FormItem>
            <FormItem label="API类型">
                {{
                    default: () => <RadioGroup v-model={instance.value.apiType} type="button"
                                               disabled={instance.value.scope != ExportScope.ALL}>
                        <Radio value={ApiType.BASE}>基础API</Radio>
                        <Radio value={ApiType.SCROLL}>scroll api</Radio>
                    </RadioGroup>,
                    help: () => {
                        if (instance.value.scope != ExportScope.ALL) {
                            return <span>只有导出全部才可以选择API</span>
                        } else if (instance.value.apiType === ApiType.BASE) {
                            return <span>基础分页API</span>
                        } else if (instance.value.apiType === ApiType.SCROLL) {
                            return <span>scroll api，适合导出大批量数据，没有10000条限制</span>
                        }
                    }
                }}
            </FormItem>
            {isScroll(instance)}
        </Form>,
        width: "400px",
        onOpen() {
            // 打开
        }
    });
}

function getDefaultConfig(config: ConditionExportEvent): ExportConfig {
    return {
        name: config.name,
        type: ExportType.JSON,
        separator: '',
        scope: ExportScope.CURRENT,
        customStart: 1,
        customEnd: 2,
        source: ExportSource.ALL,
        fields: [],
        size: 1000,
        mode: ExportMode.DOWNLOAD,
        search: config.search,
        index: config.index,
        apiType: ApiType.BASE,
        scrollTime: "1m"
    }
}

function isText(instance: Ref<ExportConfig>) {
    if (instance.value.type === ExportType.TXT) {
        return <FormItem label="分隔符">
            <Input v-model={instance.value.separator}/>
        </FormItem>;
    }
}

function isCustom(instance: Ref<ExportConfig>) {
    if (instance.value.scope === ExportScope.CUSTOM) {
        return <FormItem label="范围">
            <InputGroup>
                <InputNumber v-model={instance.value.customStart} min={1}/>
                <span> - </span>
                <InputNumber v-model={instance.value.customEnd} min={instance.value.customStart}/>
            </InputGroup>
        </FormItem>;
    }
}

function isCurrent(instance: Ref<ExportConfig>) {
    if (instance.value.scope !== ExportScope.CURRENT) {
        return <FormItem label="每页大小">
            <InputNumber v-model={instance.value.size} min={1}/>
        </FormItem>
    }
}

function isScroll(instance: Ref<ExportConfig>) {
    if (instance.value.apiType === ApiType.SCROLL) {
        return <FormItem label="滚动时间">
            {{
                default: () => <Input v-model={instance.value.scrollTime}/>,
                help: () => {
                    return <span>如果使用滚动API报错，可以适当加大此参数</span>
                }
            }}
        </FormItem>
    }
}
