/* eslint-disable */

declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}


interface Window {
    preload: {
        axios: <T>(config: any) => any,
        iconv(content: any, charset: string): string,
    }
}
