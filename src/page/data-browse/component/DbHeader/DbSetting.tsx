import {Form, FormItem, Modal, Switch} from "@arco-design/web-vue";
import {ref} from "vue";
import {useDbSettingStore} from "@/page/data-browse/store/DbSettingStore";
import {clone} from "xe-utils";
import MessageUtil from "@/utils/MessageUtil";

export function openDbSetting() {
    const dbSetting = ref(clone(useDbSettingStore().dbSetting, true));
    Modal.open({
        title: '设置',
        content: () => <Form model={dbSetting.value} layout={'vertical'}>
            <FormItem label={'是否启用track_total_hits'}>
                {{
                    default: () => <Switch v-model={dbSetting.value.enableTrackTotalHits}/>,
                    help: () => <span>启用track_total_hits可实现突破10000条显示</span>
                }}
            </FormItem>
        </Form>,
        okText: '保存',
        async onBeforeOk() {
            try {
                await useDbSettingStore().save(dbSetting.value);
                MessageUtil.success("保存成功");
                return Promise.resolve(true);
            } catch (e) {
                MessageUtil.error("保存失败", e);
                return Promise.resolve(false);
            }
        }
    })
}
