import {ref} from "vue";
import {Button, Modal} from "@arco-design/web-vue";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import {jumpToSeniorSearchByInsert, jumpToSeniorSearchByUpdate} from "@/page/data-browse/store/DbResultStore";

/**
 * 执行新增操作
 *
 * @param indexName 索引名称
 * @param initData 初始数据
 * @return 数据内容
 */
export function execAdd(indexName: string, initData: string): Promise<string> {
    const data = ref(initData);
    return new Promise(resolve => {
        let modalReturn = Modal.open({
            title: `在【${indexName}】中新增数据`,
            width: "800px",
            draggable: true,
            content: () => <MonacoEditor height={`${Math.min(window.innerHeight - 161, 400)}px`} language="json"
                                         v-model={data.value}/>,
            footer: () => <>
                <Button type="text"
                        onClick={() => jumpToSeniorSearchByInsert(data.value)
                            .finally(modalReturn.close)}>跳转到高级查询</Button>
                <Button onClick={() => modalReturn.close()}>取消</Button>
                <Button type="primary" onClick={() => {
                    resolve(data.value);
                    modalReturn.close();
                }}>新增</Button>
            </>
        });
    });
}

export function execUpdate(indexName: string, id: string, initData: string): Promise<{
    id: string,
    data: string
}> {
    const data = ref(initData);
    return new Promise(resolve => {
        let modalReturn = Modal.open({
            title: `在【${indexName}】中修改【${id}】数据`,
            width: "800px",
            draggable: true,
            content: () => <MonacoEditor height={`${Math.min(window.innerHeight - 161, 400)}px`} language="json"
                                         v-model={data.value}/>,
            footer: () => <>
                <Button type="text"
                        onClick={() => jumpToSeniorSearchByUpdate(id, data.value)
                            .finally(modalReturn.close)}>跳转到高级查询</Button>
                <Button onClick={() => modalReturn.close()}>取消</Button>
                <Button type="primary" onClick={() => {
                    resolve({id, data: data.value});
                    modalReturn.close();
                }}>修改</Button>
            </>
        });
    });

}
