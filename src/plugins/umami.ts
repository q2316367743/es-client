export const useUmami = {

  track(event: string, data?: Record<string, string | number | boolean>): void {
    if (utools.isDev()) {
      console.log('开发环境，不记录事件', event, data);
      return;
    }
    try {
      window.umami.track(event, data);
    } catch (e) {
      console.error(e);
    }
  }
// <!--<script defer src="/plugins/umami.js" data-website-id="ddf93df3-507f-45be-8a75-f52576803400"-->
// <!--        data-host-url="https://umami.esion.xyz"></script>-->

}
