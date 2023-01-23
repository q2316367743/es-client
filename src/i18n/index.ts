import { createI18n } from 'vue-i18n' //引入vue-i18n组件
import { getDefaultLanguage } from '@/utils/GlobalUtil';
import zhCn from '@/i18n/languages/zhCn.json';
import enUs from '@/i18n/languages/enUs.json';

const i18n = createI18n({
    fallbackLocale: 'zhCn',
    globalInjection: true,
    legacy: false, // you must specify 'legacy: false' option
    locale: getDefaultLanguage(),
    messages: {
        zhCn,
        enUs
    },
});

export default i18n