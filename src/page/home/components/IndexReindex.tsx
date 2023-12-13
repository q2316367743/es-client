import useIndexStore from "@/store/IndexStore";
import IndexView from "@/view/index/IndexView";
import {Button, Modal, Select, Option, Switch, Form, FormItem, ModalReturn} from "@arco-design/web-vue";
import {Ref, ref} from "vue";
import MessageUtil from "@/utils/MessageUtil";
import useLoadingStore from "@/store/LoadingStore";
import {fetchEs} from "@/plugins/axios";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";

interface Config {
    index: string;
    async: boolean;
}

/**
 * 索引迁移，从一个索引转到另一个索引
 * @param index
 */
export function indexReindex(index: string) {
    // 全部的索引
    const indices: Array<IndexView> = useIndexStore().indices;
    const config = ref<Config>({
        index: '',
        async: false
    });

    let modalReturn = Modal.open({
        title: `索引【${index}】迁移`,
        content: () => <>
            <div style="margin-bottom: 7px;">
                如果 Mapping 中字段已经定义就不能修改其字段的类型等属性了，同时也不能改变分片的数量，
                可以使用 Reindex API 来解决这个问题。
            </div>
            <Form model={config.value} layout="vertical">
                <FormItem label="目标索引">
                    <Select v-model={config.value.index} allowSearch allowClear>
                        {indices.map(item =>
                            <Option key={item.name} value={item.name}
                                    disabled={item.name === index}>{item.name}</Option>)}
                    </Select>
                </FormItem>
                <FormItem label="是否异步">
                    {{
                        default: () => <Switch v-model={config.value.async} type="round"/>,
                        help: () => <span>如果索引数据量较大，建议开启异步，以免造成请求超时。</span>
                    }}
                </FormItem>
            </Form>
        </>,
        footer: () => <>
            <Button type="text" onClick={() => jumpTo(index, config, modalReturn)}>跳转到高级查询</Button>
            <Button onClick={() => modalReturn.close()}>取消</Button>
            <Button type="primary" onClick={() => onOk(index, config, modalReturn)}>执行</Button>
        </>,
        draggable: true,
    });
}

function jumpTo(index: string, config: Ref<Config>, modalReturn: ModalReturn) {
    useSeniorSearchStore().loadEvent({
        method: 'POST',
        link: '_reindex' + (config.value.async ? '?wait_for_completion=false' : ''),
        body: `{
    "source": {"index": "${index}",
    "dest": {"index": "${config.value.index}"}
}`
    });
    modalReturn.close();
}

function onOk(index: string, config: Ref<Config>, modalReturn: ModalReturn) {
    if (config.value.index == '') {
        MessageUtil.warning("请选择目标索引");
        return;
    }
    useLoadingStore().start("开始进行索引迁移");
    fetchEs<string>({
        url: '_reindex' + (config.value.async ? '?wait_for_completion=false' : ''),
        method: 'POST',
        data: {
            source: {index: index},
            dest: {index: config.value.index}
        },
        responseType: 'text'
    }).then(res => MessageUtil.success(res))
        .catch(e => MessageUtil.error("迁移失败", e))
        .finally(() => {
            useLoadingStore().close();
            modalReturn.close();
        })
}
