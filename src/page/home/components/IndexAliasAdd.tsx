import {Alert, Input, Modal} from "@arco-design/web-vue";
import AppLink from "@/components/AppLink/AppLink.vue";

export function indexAliasAdd(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const name = ref('')
    Modal.confirm({
      content: () => <div class="domain-prompt">
        <div>请输入新别名</div>
        <Input type="text" v-model={name.value} style={{marginTop: '8px'}}/>
        <Alert title={"别名功能不够用？"} style={{marginTop: '8px'}}>
          <span>⚙️ </span>
          <AppLink event="新建别名"/>
          <span>支持完整别名参数设置（如 routing、filter），满足高级需求！</span>
        </Alert>
      </div>,
      title: '提示',
      draggable: true,
      onOk: () => {
        resolve(name.value);
      },
      onCancel: () => {
        reject('cancel');
      },
      onClose: () => {
        reject('close');
      }
    })
  })
}