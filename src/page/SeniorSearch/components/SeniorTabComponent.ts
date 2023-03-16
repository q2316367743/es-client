import TabMenuItem from "@/components/TabMenu/TabMenuItem";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import { seniorSearchHistoryService } from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import useUrlStore from "@/store/UrlStore";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";
import { Ref, ref } from "vue";
import { SeniorSearchItem } from "../domain/SeniorSearchItem";

export default class SeniorTabComponent {

    readonly searchMap: Ref<Map<number, SeniorSearchItem>>;
    searchHeader: Ref<Array<TabMenuItem>>;
    searchId: Ref<number>;
    header: Ref<TabMenuItem>;
    body: Ref<string>;

    constructor() {
        let searchMap = new Map<number, SeniorSearchItem>();
        let searchId = new Date().getTime();
        let searchItem = {
            header: {
                id: searchId,
                name: '高级查询'
            },
            body: ''
        } as SeniorSearchItem;
        searchMap.set(searchId, searchItem);
        this.searchMap = ref<Map<number, SeniorSearchItem>>(searchMap);
        this.searchId = ref<number>(searchId);
        this.searchHeader = ref<Array<TabMenuItem>>([searchItem.header]);
        this.header = ref<TabMenuItem>(searchItem.header);
        this.body = ref<string>(searchItem.body);
    }

    private _sync(): void {
        let searchItem = this.searchMap.value.get(this.searchId.value);
        if (!searchItem) {
            if (this.searchMap.value.size === 0) {
                // 重新创建
                searchItem = this.add();
            }else {
                // 指向第一个
                this.searchId.value = this.searchMap.value.keys().next().value;
                this._sync();
                return;
            }
        }
        this.header.value = searchItem.header;
        this.body.value = searchItem.body;
        this.searchHeader.value = Array.from(this.searchMap.value.values()).map(e => e.header);
    }

    sync(body: string) {
        let searchItem = this.searchMap.value.get(this.searchId.value);
        if (searchItem) {
            searchItem.body = body;
        }else {
            MessageUtil.warning('当前编辑器未正确关联标签页，切换标签页内容将会丢失！');
        }
    }

    /**
     * 根据ID切换当前
     * @param id ID
     */
    choose(id: number): SeniorSearchItem {
        this.searchId.value = id;
        this._sync();
        return this.searchMap.value.get(this.searchId.value)!
    }

    /**
     * 关闭一个标签
     * @param id 标签ID
     */
    close(): void {
        this.searchMap.value.delete(this.searchId.value);
        this._sync();
    }

    closeOther(): void {
        for (let item of Array.from(this.searchMap.value.keys())) {
            if (item !== this.searchId.value) {
                this.searchMap.value.delete(item);
            }
        }
    }

    /**
     * 关闭全部标签
     */
    closeAll(): void {
        this.searchMap.value.clear();
        this._sync();
    }

    /**
     * 重命名
     */
    rename(): void {
        MessageBoxUtil.prompt("请输入新的标签名字", "修改标签名", {
            confirmButtonText: '修改',
            cancelButtonText: '取消',
            inputValue: this.header.value.name,
            inputPattern: /.+/,
            inputErrorMessage: '必须输入标签名'
        }).then((value) => {
            this.header.value.name = value;
        }).catch(() => {
        });
    }

    /**
     * 将当前标签保存到历史
     */
    save(): void {
        MessageBoxUtil.prompt('请输入记录名字', '新增记录', {
            confirmButtonText: '新增',
            cancelButtonText: '取消',
            inputValue: isNaN(parseInt(this.header.value.name)) ? this.header.value.name : '',
            inputPattern: /\S+/,
            inputErrorMessage: '请输入有效字符'
        })
            .then(value => {
                seniorSearchHistoryService.save({
                    urlId: Optional.ofNullable(useUrlStore().id).orElse(0),
                    name: value,
                    body: this.body.value,
                })
                    .then(id => {
                        // 发送消息
                        MessageUtil.success('新增成功');
                        // 发送事件
                        emitter.emit(MessageEventEnum.SENIOR_HISTORY_UPDATE);
                        // 修改标签
                        this.header.value.relationId = id;
                        this.header.value.name = value;
                    })
                    .catch(e => MessageUtil.error('新增失败', e));
            })
            .catch(() => console.log('取消新增'));
    }

    /**
     * 更新当前链接
     */
    update(): void {
        if (this.header.value.relationId) {
            seniorSearchHistoryService.update({
                id: this.header.value.relationId,
                name: this.header.value.name,
                body: this.body.value,
            })
                .then(() => MessageUtil.success('更新成功', () => emitter.emit(MessageEventEnum.SENIOR_HISTORY_UPDATE)))
                .catch(e => MessageUtil.error('更新失败', e));
        }else {
            this.save();
        }
    }

    /**
     * 清除全部
     */
    clear() {
        this.header.value.relationId = undefined;
        this.header.value.name = '高级查询';
        this.body.value = '';
    }

    /**
     * 新增一个标签
     */
    add(): SeniorSearchItem {
        // 重新创建
        let searchId = new Date().getTime();
        let searchItem = {
            header: {
                id: searchId,
                name: '高级查询'
            },
            body: ''
        } as SeniorSearchItem;
        this.searchMap.value.set(searchId, searchItem);
        this.searchId.value = searchId;
        return searchItem;
    }

    /**
     * 移除一个标签
     * @param id ID
     */
    remove(id: number) {
        this.searchMap.value.delete(id);
        this._sync();
    }

}