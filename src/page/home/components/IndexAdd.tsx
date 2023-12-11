import {Ref, ref} from "vue";
import {Modal, Form, FormItem, Input, InputNumber, Tabs, TabPane, ModalReturn, Button} from "@arco-design/web-vue";
import {IndexCreate} from "@/components/es/domain/IndexCreate";
import {getDefaultIndexInstance, IndexInstance} from "@/domain/IndexInstance";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import MessageUtil from "@/utils/MessageUtil";
import indexApi from "@/components/es/api/IndexApi";
import useIndexStore from "@/store/IndexStore";
import useLoadingStore from "@/store/LoadingStore";
import MonacoEditor from "@/components/monaco-editor/index.vue";

export function indexAdd(): void {
    const index: Ref<IndexInstance> = ref<IndexInstance>(getDefaultIndexInstance());
    let modalReturn: ModalReturn = Modal.open({
        title: "新建索引",
        width: "850px",
        draggable: true,
        modalClass: "home-index-add",
        renderToBody: true,
        fullscreen: true,
        content: () => <>
            <Form model={index} layout="vertical">
                <FormItem label="名称">
                    <Input style="width: 300px;"></Input>
                </FormItem>
            </Form>
            <Tabs>
                <TabPane title="设置" key="1">
                    <Form model={index.value.settings} layout="vertical">
                        <FormItem label="分片数">
                            <InputNumber v-model={index.value.settings.number_of_shards}/>
                        </FormItem>
                        <FormItem label="副本数">
                            <InputNumber v-model={index.value.settings.number_of_replicas}/>
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane title="映射设置" key="2">
                    <MonacoEditor v-model={index.value.mappings} language="json"
                                   height={window.innerHeight - 200 + 'px'}/>
                </TabPane>
            </Tabs>
        </>,
        footer: () => <>
            <Button type="text" onClick={() => jumpToSeniorSearch(index, modalReturn)}>跳转到高级查询</Button>
            <Button type="text" onClick={() => copyIndex(index, modalReturn)}>复制到剪切板</Button>
            <Button type="secondary" onClick={() => modalReturn.close()}>取消</Button>
            <Button type="primary" onClick={() => addIndex(index, modalReturn)}>新增</Button>
        </>,
    });
}

function jumpToSeniorSearch(index: Ref<IndexInstance>, modalReturn: ModalReturn) {
    // 构建数据
    // 高级查询数据填充
    useSeniorSearchStore().loadEvent({
        link: '/' + index.value.name,
        method: 'PUT',
        body: JSON.stringify(getIndexCreate(index), null, 4)
    });
    modalReturn.close();
}

function copyIndex(index: Ref<IndexInstance>, modalReturn: ModalReturn) {
    // 执行拷贝
    utools.copyText(JSON.stringify(getIndexCreate(index), null, 4));
    MessageUtil.success("已成功复制到剪切板");
    modalReturn.close();
}

function addIndex(index: Ref<IndexInstance>, modalReturn: ModalReturn) {
    useLoadingStore().start("正在新增索引")
    // 新增
    indexApi(index.value.name).create(getIndexCreate(index))
        .then(res => MessageUtil.success(res, useIndexStore().reset))
        .catch(e => MessageUtil.error('索引创建错误', e))
        .finally(useLoadingStore().close);
    modalReturn.close()
}


function getIndexCreate(index: Ref<IndexInstance>): IndexCreate {
    return {
        settings: index.value.settings,
        mappings: JSON.parse(index.value.mappings)
    };
}
