// 导入vue-router，用于获取当前的hash
import router from "@/plugins/router";
import {getItem, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {generateUUID} from "@/utils/BrowserUtil";

let token = getItem<string>(LocalNameEnum.KEY_TOKEN);
if (!token) {
  token = generateUUID();
  setItem(LocalNameEnum.KEY_TOKEN, token);
}
const profileId = token;

// 注册路由跳转事件
router.beforeEach((to) => {
  useUmami.page(to.path, to.name as string);
});

const umami = {
  // 网站ID
  id: "ddf93df3-507f-45be-8a75-f52576803400",
  // umami服务器地址
  url: "https://umami.esion.xyz"
};

function buildBasePayload() {
  return {
    hostname: import.meta.env.VITE_HOMENAME,
    language: navigator.language,
    referrer: import.meta.env.VITE_REFERRER,
    screen: `${window.screen.width}x${window.screen.height}`,
    website: umami.id
  };
}

function buildPayload() {
  const {path, name} = router.currentRoute.value;
  return {
    ...buildBasePayload(),
    title: `${(name as string) || document.title}`,
    url: path
  };
}

const buildPathPayload = (path: string, name?: string) => ({
  ...buildBasePayload(),
  url: path,
  title: name || document.title,
  id: profileId
});

function sendEvent(payload: Record<string, any>) {
  if (import.meta.env.DEV) {
    console.debug("Umami payload:", payload);
    return;
  }
  fetch(`${umami.url}/api/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      payload: payload,
      type: "event"
    })
  })
    .then((response) => response.text())
    .then((text) => console.log("Umami response:", text))
    .catch((error) => console.error("Umami error:", error));
}

export const useUmami = {
  track(event?: string, data?: Record<string, string> | string): void {
    const payload: Record<string, any> = buildPayload();
    if (event) {
      payload.name = event;
    }
    if (typeof data === "string") {
      payload.data = {value: data};
    } else if (data) {
      payload.data = data;
    }
    sendEvent(payload);
  },

  page(path: string, name?: string): void {
    const payload = buildPathPayload(path, name);
    sendEvent(payload);
  }
};
