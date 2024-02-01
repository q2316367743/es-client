import {Button, Form, FormItem, Input, InputNumber, Modal, Option, Select, Switch} from "@arco-design/web-vue";
import {ref} from "vue";
import useEditorSettingStore from "@/store/setting/EditorSettingStore";
import MessageUtil from "@/utils/MessageUtil";

export function useSeniorSearchSetting() {
    const instance = ref(useEditorSettingStore().getSetting);

    function save() {
        useEditorSettingStore().save(instance.value).then(() => {
            MessageUtil.success('保存成功，重启插件后生效');
            modalReturn.close();
        });
    }

    const modalReturn = Modal.open({
        title: "编辑器设置",
        draggable: true,
        renderToBody: true,
        width: 600,
        footer: false,
        content: () => <Form model={instance.value} layout="vertical">
            <FormItem label="字体大小">
                <InputNumber v-model={instance.value.fontSize} min={8} max={100} step={1} style="width: 100px"/>
            </FormItem>
            <FormItem label="显示小地图">
                <Switch v-model={instance.value.minimap} checkedValue={true} uncheckedValue={false} type="round">
                    {{
                        checked: () => <span>显示</span>,
                        unchecked: () => <span>隐藏</span>
                    }}
                </Switch>
            </FormItem>
            <FormItem label="换行">
                <Select v-model={instance.value.wordWrap} style="width: 200px">
                    <Option label="启用" value="on"/>
                    <Option label="禁用" value="off"/>
                    <Option label="单词处换行" value="wordWrapColumn"/>
                    <Option label="最小值换行" value="bounded"/>
                </Select>
            </FormItem>
            <FormItem label="运行 - 字体颜色">
                <Input v-model={instance.value.runColor} placeholder="颜色，十六进制"/>
            </FormItem>
            <div style="text-align: right;margin-top: 18px">
                <Button onClick={modalReturn.close}>取消</Button>
                <Button onClick={save} type="primary">保存</Button>
            </div>
        </Form>
    });
}
