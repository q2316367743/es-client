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

}
