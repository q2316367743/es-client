import {ref} from "vue";
import {Method} from "axios";
import {Drawer, Form, FormItem, Input, Radio, RadioGroup, Textarea} from "@arco-design/web-vue";
import {createSeniorSearchRequestContent} from "@/entity/history/SeniorSearchRequest";
import {useSeniorSearchRequestStore} from "@/store/history/SeniorSearchRequestStore";
import MessageUtil from "@/utils/MessageUtil";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";

const {post, remove, getById} = useSeniorSearchRequestStore();

export function openQuickAdd(sourceId?: number) {
    const okText = sourceId ? '修改' : '新增';

    const data = ref(createSeniorSearchRequestContent());
    let contentRev: string | undefined = undefined;
    if (sourceId) {
        getById(sourceId).then((result) => {
            data.value = result.record;
            contentRev = result.rev;
        }).catch((e) => {
            MessageUtil.error("获取快捷命令失败", e);
        })
    }

    Drawer.open({
        title: okText + '快捷命令',
        content: () => <Form model={data.value} layout={'vertical'}>
            <FormItem label={'名称'} field={'name'}>
                <Input v-model={data.value.name} allowClear placeholder={'请输入名称'} maxLength={64}
                       showWordLimit={true}/>
            </FormItem>
            <FormItem label={'描述'} field={'description'}>
                <Textarea v-model={data.value.description} allowClear placeholder={'请输入描述'} maxLength={255}
                          showWordLimit={true} autoSize={{minRows: 3, maxRows: 10}}/>
            </FormItem>
            <FormItem label={'请求方式'} field={'method'}>
                <RadioGroup v-model={data.value.method}>
                    <Radio value={'GET'}>GET</Radio>
                    <Radio value={'POST'}>POST</Radio>
                    <Radio value={'PUT'}>PUT</Radio>
                    <Radio value={'DELETE'}>DELETE</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label={'请求地址'} field={'url'}>
                <Input v-model={data.value.url} allowClear placeholder={'请输入请求地址'} maxLength={255}
                       showWordLimit={true}/>
            </FormItem>
            <FormItem label={'请求体'} field={'body'}>
                <MonacoEditor v-model={data.value.body} language={'json'} height={'200px'}/>
            </FormItem>
        </Form>,
        width: 600,
        okText,
        async onBeforeOk() {
            try {
                await post(data.value);
                MessageUtil.success(okText + '成功');
                return true;
            } catch (e) {
                MessageUtil.error(okText + "新增失败", e);
                return false;
            }
        }
    })
}

export function openQuickDelete(sourceId: number) {
    remove(sourceId)
        .then(() => {
            MessageUtil.success("删除成功");
        })
        .catch(e => {
            MessageUtil.error("删除失败", e);
        })
}

export function loadQuickOpera(sourceId: number) {
    getById(sourceId).then((result) => {
        const {record} = result;
        useSeniorSearchStore().loadEvent({
            link: record.url,
            method: record.method as Method,
            body: record.body
        }, false);

    }).catch((e) => {
        MessageUtil.error("获取快捷命令失败", e);
    })
}
