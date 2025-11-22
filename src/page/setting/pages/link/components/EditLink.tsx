import {
  Button,
  Form,
  FormItem,
  Input,
  InputPassword,
  Modal,
  Radio,
  RadioGroup,
  Result,
  Spin,
  Switch,
  Trigger
} from "@arco-design/web-vue";
import {getDefaultUrl, Url} from "@/entity/Url";
import UrlAuthTypeEnum from "@/enumeration/UrlAuthTypeEnum";
import './EditLink.less';
import {useRequestJson} from "@/plugins/native/axios";
import useUrlStore, {buildRequestConfig} from "@/store/UrlStore";
import MessageUtil from "@/utils/MessageUtil";
import {clone} from "xe-utils";
import {Overview} from "@/domain/es/Overview";

export function openAddLink() {
  const link = ref(getDefaultUrl());

  function submit() {
    useUrlStore().add(link.value)
      .then(() => {
        MessageUtil.success("新增成功");
        modalReturn.close();
      })
      .catch(e => MessageUtil.error("新增失败", e))
  }

  const modalReturn = Modal.open({
    title: '新增链接',
    draggable: true,
    content: () => buildForm(link),
    footer: () => buildFooter(link, 0, submit)
  });
}

export function openUpdateLink(record: Url) {
  const link = ref(clone(record, true));

  function submit() {
    useUrlStore().update(record.id, link.value)
      .then(() => {
        MessageUtil.success("修改成功");
        modalReturn.close();
      })
      .catch(e => MessageUtil.error("修改失败", e))
  }

  const modalReturn = Modal.open({
    title: '新增链接',
    draggable: true,
    content: () => buildForm(link),
    footer: () => buildFooter(link, record.id, submit)
  });
}

function buildForm(link: Ref<Url>) {
  const authUser = computed(() => {
    if (link.value.authType === UrlAuthTypeEnum.BASIC) {
      return "用户名"
    } else if (link.value.authType === UrlAuthTypeEnum.HEADER) {
      return "请求头键"
    } else {
      return '';
    }
  });
  const authPassword = computed(() => {
    if (link.value.authType === UrlAuthTypeEnum.HEADER) {
      return "请求头值"
    } else if (link.value.authType === UrlAuthTypeEnum.COOKIE) {
      return "Cookie值"
    } else {
      return '密码';
    }
  });

  return <Form model={link.value} layout={'vertical'}>
    <FormItem label={'名称'}>
      <Input v-model={link.value.name} allowClear/>
    </FormItem>
    <FormItem label={'链接'}>{{
      default: () => <Input v-model={link.value.value} allowClear/>,
      help: () => link.value.value.endsWith('/') &&
        <span style={{color: 'rgb(var(--danger-6))'}}>检测到链接以/结尾，可能造成报错，建议删除结尾的/</span>
    }}</FormItem>
    <FormItem label={'版本'}>
      <Input v-model={link.value.version} allowClear/>
    </FormItem>
    <FormItem label={'是否认证'}>
      <Switch v-model={link.value.isAuth}/>
    </FormItem>
    {link.value.isAuth && <>
      <FormItem label={'认证方式'}>
        <RadioGroup v-model={link.value.authType}>
          <Radio value={UrlAuthTypeEnum.BASIC}>基础认证</Radio>
          <Radio value={UrlAuthTypeEnum.HEADER}>请求头认证</Radio>
          <Radio value={UrlAuthTypeEnum.COOKIE}>Cookie认证</Radio>
        </RadioGroup>
      </FormItem>
      {link.value.authType !== UrlAuthTypeEnum.COOKIE &&
        <FormItem label={authUser.value}>
          <Input v-model={link.value.authUser} allowClear/>
        </FormItem>}
      <FormItem label={authPassword.value}>
        <InputPassword v-model={link.value.authPassword}/>
      </FormItem>
    </>}
  </Form>
}

function buildFooter(link: Ref<Url>, id: number, submit: () => void) {
  const loading = ref(false);
  const testData = ref({
    icon: 'info' as 'success' | 'error' | 'info',
    title: '',
    name: '',
    version: '',
    luceneVersion: ''
  });

  function test() {
    loading.value = true;
    testData.value = {
      icon: 'info',
      title: '',
      name: '',
      version: '',
      luceneVersion: ''
    };
    useRequestJson<Overview>('/', buildRequestConfig(link.value))
      .then((response) => {
        testData.value = {
          icon: 'success',
          title: '链接成功',
          name: response.name,
          version: response.version.number,
          luceneVersion: response.version.lucene_version
        }
        link.value.version = `${response.version.number}`;
      }).catch(() => {
      testData.value = {
        icon: 'error',
        title: '链接不可用',
        name: '',
        version: '',
        luceneVersion: ''
      }
    }).finally(() => {
      loading.value = false;
    });
  }

  return <>
    <Trigger position={'top'} trigger={'click'} contentClass={'edit-link-content'}>
      {{
        default: () => <Button onClick={test}>测试</Button>,
        content: () => <Spin loading={loading.value}>
          <Result status={testData.value.icon} title={testData.value.title}>
            {{
              subtitle: () => <span>{testData.value.name}</span>,
              extra: () => <>
                {testData.value.icon === 'success' &&
                  <div>elasticsearch版本：{testData.value.version}</div>}
                {testData.value.icon === 'success' &&
                  <div class={'lucene'}>lucene版本：{testData.value.luceneVersion}</div>}
              </>
            }}
          </Result>
        </Spin>
      }}
    </Trigger>
    <Button type={'primary'} onClick={submit}>
      {id === 0 ? '新增' : '修改'}
    </Button>
  </>
}
