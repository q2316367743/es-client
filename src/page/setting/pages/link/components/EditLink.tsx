import {
  Button,
  DialogPlugin,
  Form,
  FormItem,
  Input,
  LoadingPlugin,
  Radio,
  RadioButton,
  RadioGroup,
  Space,
  Switch
} from "tdesign-vue-next";
import {getDefaultUrl, Url, UrlForm } from "@/entity/Url";
import "./EditLink.less";
import {useUrlStore} from "@/store";
import MessageUtil from "@/utils/model/MessageUtil";
import {cloneDeep} from "es-toolkit";
import NotificationUtil from "@/utils/model/NotificationUtil";
import {buildEsRequestConfig, useRequestJson} from "@/plugins/native/axios";
import i18n from "@/i18n";

const t = (key: string) => i18n.global.t(key);

export function openAddLink() {
  const link = ref(getDefaultUrl());
  const submitting = ref(false);

  function submit() {
    if (submitting.value) return;

    if (!link.value.name) {
      MessageUtil.error(t('setting.name_required'));
      return;
    }
    if (!link.value.value) {
      MessageUtil.error(t('setting.link_required'));
      return;
    }
    if (!link.value.version) {
      MessageUtil.error(t('setting.test_first'));
      return;
    }

    submitting.value = true;
    useUrlStore()
      .add(cloneDeep(link.value))
      .then(() => {
        MessageUtil.success(t('setting.add_success'));
        modalReturn.destroy();
      })
      .catch((e) => MessageUtil.error(t('setting.add_failed'), e))
      .finally(() => {
        submitting.value = false;
      });
  }

  const modalReturn = DialogPlugin({
    header: t('setting.add_link'),
    placement: "center",
    draggable: true,
    default: () => buildForm(link),
    footer: () => buildFooter(link, '', submit, submitting)
  });
}

export function openUpdateLink(record: Url) {
  const link = ref(cloneDeep({...record, platform: record.platform || "elasticsearch"}));
  const submitting = ref(false);

  function submit() {
    if (submitting.value) return;

    if (!link.value.name) {
      MessageUtil.error(t('setting.name_required'));
      return;
    }
    if (!link.value.value) {
      MessageUtil.error(t('setting.link_required'));
      return;
    }

    // 检查连接信息是否变更
    const connectionChanged =
      record.value !== link.value.value ||
      record.isAuth !== link.value.isAuth ||
      record.authType !== link.value.authType ||
      record.authUser !== link.value.authUser ||
      record.authPassword !== link.value.authPassword;

    // 如果连接信息变更，必须先测试连接
    if (connectionChanged && !link.value.version) {
      MessageUtil.error(t('setting.test_first'));
      return;
    }

    submitting.value = true;
    useUrlStore()
      .update(record.id, cloneDeep(link.value))
      .then(() => {
        MessageUtil.success(t('setting.update_success'));
        modalReturn.destroy();
      })
      .catch((e) => MessageUtil.error(t('setting.update_failed'), e))
      .finally(() => {
        submitting.value = false;
      });
  }

  const modalReturn = DialogPlugin({
    header: t('setting.edit_link'),
    placement: "center",
    draggable: true,
    default: () => buildForm(link),
    footer: () => buildFooter(link, record.id, submit, submitting)
  });
}

function buildForm(link: Ref<UrlForm>) {
  const authUser = computed(() => {
    if (link.value.authType === 1) {
      return t('setting.username')
    } else if (link.value.authType === 2) {
      return t('setting.header_key')
    } else {
      return ''
    }
  })
  const authPassword = computed(() => {
    if (link.value.authType === 2) {
      return t('setting.header_value')
    } else if (link.value.authType === 3) {
      return t('setting.cookie_value')
    } else {
      return t('setting.password')
    }
  })

  return (
    <Form data={link.value} layout={'vertical'}>
      <FormItem label={t('setting.name')} labelAlign={'top'}>
        <Input v-model={link.value.name} clearable />
      </FormItem>
      <FormItem label={t('setting.link')} labelAlign={'top'}>
        {{
          default: () => <Input v-model={link.value.value} clearable />,
          help: () =>
            link.value.value.endsWith('/') && (
              <span style={{ color: 'rgb(var(--danger-6))' }}>{t('setting.slash_warning')}</span>
            )
        }}
      </FormItem>
      <FormItem label={t('setting.platform')} labelAlign={'top'}>
        <RadioGroup
          variant="primary-filled"
          v-model={link.value.platform}
          defaultValue={'elasticsearch'}
        >
          <RadioButton value={'elasticsearch'}>elasticsearch</RadioButton>
          <RadioButton value={'opensearch'} disabled>
            opensearch
          </RadioButton>
          <RadioButton value={'easysearch'} disabled>
            easysearch
          </RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem label={t('setting.version')} labelAlign={'top'}>
        <Input v-model={link.value.version} readonly />
      </FormItem>
      <FormItem label={t('setting.is_auth')} labelAlign={'top'}>
        <Switch v-model={link.value.isAuth} />
      </FormItem>
      {link.value.isAuth && (
        <>
          <FormItem label={t('setting.auth_type')} labelAlign={'top'}>
            <RadioGroup v-model={link.value.authType}>
              <Radio value={1}>{t('setting.basic_auth')}</Radio>
              <Radio value={2}>{t('setting.header_auth')}</Radio>
              <Radio value={3}>{t('setting.cookie_auth')}</Radio>
            </RadioGroup>
          </FormItem>
          {link.value.authType !== 3 && (
            <FormItem label={authUser.value} labelAlign={'top'}>
              <Input v-model={link.value.authUser} clearable />
            </FormItem>
          )}
          <FormItem label={authPassword.value} labelAlign={'top'}>
            <Input type={'password'} v-model={link.value.authPassword} />
          </FormItem>
        </>
      )}
    </Form>
  )
}

function buildFooter(
  link: Ref<UrlForm>,
  id: string,
  submit: () => void,
  submitting?: Ref<boolean>
) {
  const testing = ref(false)

  function test() {
    if (testing.value) return
    testing.value = true
    const lp = LoadingPlugin({ content: t('setting.loading') })
    useRequestJson('/', buildEsRequestConfig({}, cloneDeep(link.value)))
      .then((response) => {
        link.value.version = `${response.version.number}`
        NotificationUtil.success(
          () => (
            <div>
              <div>
                {t('setting.name')}：{response.name.name}
              </div>
              <div>
                {t('setting.version')}：{response.version.number}
              </div>
              <div>
                Lucene {t('setting.version')}：{response.version.lucene_version}
              </div>
            </div>
          ),
          t('setting.test_success')
        )
      })
      .catch((e) => {
        NotificationUtil.error(`${t('setting.link_unavailable')}: ${e}`, t('setting.test_failed'))
      })
      .finally(() => {
        testing.value = false
        lp.hide()
      })
  }

  return (
    <Space>
      <Button
        variant={'outline'}
        onClick={test}
        loading={testing.value}
        disabled={testing.value || submitting?.value}
      >
        {t('setting.test')}
      </Button>
      <Button
        theme={'primary'}
        onClick={submit}
        loading={submitting?.value}
        disabled={testing.value || submitting?.value}
      >
        {id === '' ? t('setting.add') : t('setting.update')}
      </Button>
    </Space>
  )
}
