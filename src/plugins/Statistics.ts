import {useUmami} from "@/plugins/umami";

export type EventIdentificationEnum = 'update' | 'page_jump' | 'es_version' |
  'func_data_browser' | 'func_base_search' | 'func_senior_search' |
  'func_dashboard';


export class Statistics {

  login() {
    useUmami.track('login');
  }

  register() {
    useUmami.track('register');
  }

  /**
   * 访问某个标签
   * @param event 操作
   * @param additional 附加
   */
  access(event: EventIdentificationEnum, additional?: string) {
    this.track(event, additional ? {
      additional: additional
    } : undefined);
  }

  /**
   * 时间埋点
   * @param event 操作
   * @param params 附加参数
   */
  track(event: EventIdentificationEnum, params?: Record<string, string>) {
    if (import.meta.env.DEV) {
      return;
    }
    try {
      useUmami.track(event, params)
    } catch (e) {
      console.error("自定义埋点统计失败", e);
    }
  }


}
