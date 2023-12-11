<template>
    <a-typography>
        <a-typography-title :heading="1" align="center">隐私协议</a-typography-title>

        <a-typography-paragraph>更新日期：2023年03月11日</a-typography-paragraph>

        <a-typography-paragraph>生效日期：2023年03月11日</a-typography-paragraph>

        <a-typography-title :heading="3">一、引言</a-typography-title>

        <a-typography-paragraph>
            本软件重视用户的隐私。您在使用我们的服务时，我们可能会收集和使用您的相关信息。我们希望通过本《隐私政策》向您说明，在使用我们的服务时，
            我们如何收集、使用、储存和分享这些信息，以及我们为您提供的访问、更新、控制和保护这些信息的方式。本《隐私政策》与您所使用的服务息息相关，
            希望您仔细阅读，在需要时，按照本《隐私政策》的指引，作出您认为适当的选择。本《隐私政策》中涉及的相关技术词汇，我们尽量以简明扼要的表述，
            并提供进一步说明的链接，以便您的理解。
        </a-typography-paragraph>

        <a-typography-paragraph>
            您使用或继续使用我们的服务，即意味着同意我们按照本《隐私政策》收集、使用、储存和分享您的相关信息。
        </a-typography-paragraph>

        <a-typography-title :heading="3">二、我们可能收集您的信息</a-typography-title>

        <a-typography-paragraph>
            我们提供服务时，会收集您的一些使用信息，用于分析用户使用情况来做下一步主要更新方向。主要包括：
        </a-typography-paragraph>

        <a-typography-paragraph>
            <ul>
                <li>使用的时间</li>
                <li>使用的平台</li>
                <li>您的操作系统</li>
                <li>您的es版本</li>
                <li>插件各个功能的使用情况</li>
            </ul>
        </a-typography-paragraph>

        <a-typography-title :heading="3">三、数据存储</a-typography-title>

        <a-typography-title :heading="4">插件版本、web版本、vscode版本</a-typography-title>

        <a-typography-paragraph>
            插件版本数据存储在浏览器中，其中，文档类数据存储在IndexedDB，设置类数据存储在localStorage中。
        </a-typography-paragraph>

        <a-typography-title :heading="4">桌面客户端版本</a-typography-title>

        <a-typography-paragraph>桌面客户端使用tauri打包，使用的是WebView2，本质上也是存储在浏览器中。
        </a-typography-paragraph>

        <a-typography-title :heading="4"> utools版本</a-typography-title>

        <a-typography-paragraph>
            utools版本存放在utools提供的db中，可以在账号与数据中点击插件右侧查看存储的文档数据中查看
        </a-typography-paragraph>

    </a-typography>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {utools} from "@/plugins/utools";
import Constant from "@/global/Constant";
import PluginModeEnum from "@/enumeration/PluginModeEnum";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const nickname = ref("");
const enabled = ref<boolean>(getItemByDefault<boolean>(LocalNameEnum.KEY_PRIVACY_ENABLE, true));
const platform = ref<boolean>(getItemByDefault<boolean>(LocalNameEnum.KEY_PRIVACY_PLATFORM, true));
const system = ref<boolean>(getItemByDefault<boolean>(LocalNameEnum.KEY_PRIVACY_SYSTEM, true));
const esVersion = ref<boolean>(getItemByDefault<boolean>(LocalNameEnum.KEY_PRIVACY_ES_VERSION, true));
const allowEdit = ref(Constant.mode !== PluginModeEnum.UTOOLS);

let user = utools.getUser();
if (user) {
    nickname.value = user.nickname;
}

watch(() => nickname.value, value => localStorage.setItem("nickname", value));
watch(() => enabled.value, value => setItem(LocalNameEnum.KEY_PRIVACY_ENABLE, value));
watch(() => platform.value, value => setItem(LocalNameEnum.KEY_PRIVACY_PLATFORM, value));
watch(() => system.value, value => setItem(LocalNameEnum.KEY_PRIVACY_SYSTEM, value));
</script>
<style scoped>

</style>
