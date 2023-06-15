/* eslint-disable */
declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '@json2csv/plainjs' {
    export interface Option {
        /**
         * 列的分隔符。如果未指定，则默认为`,`
         */
        delimiter?: string;
    }
    export class Parser{
        constructor(option?: Option);
        parse(data: any): string;
    }
}

interface Window {
    preload: {
        axios: any,
        iconv(content: any, charset: string): string,
    }
}

declare var rain = {
    env: string
}