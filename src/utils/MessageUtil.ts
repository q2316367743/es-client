import {Message} from '@arco-design/web-vue';
import Optional from "@/utils/Optional";

function success(message: any): void;
function success(message: any, callback: () => void): void;
function success(message: any, callback?: () => void): void {
    Message.success({
        closable: true,
        content: typeof message === 'string' ? message : JSON.stringify(message)
    });
    callback && callback();
}

function error(message: string): void;
function error(message: string, e: any): void;
function error(message: string, e: any, callback: () => void): void;
function error(message: string, e?: any, callback?: () => void): void {
    if (typeof e === 'string') {
        Message.error({
            closable: true,
            content: Optional.ofNullable(e).map(e => `${message}，${e}`).orElse(message)
        });
    } else {
        Message.error({
            closable: true,
            content: Optional.ofNullable(e).map(e => `${message}`).orElse(message)
        });
    }
    console.error(e);
    callback && callback();
}

export default {

    success,
    info(message: any) {
        Message.info({
            closable: true,
            content: typeof message === 'string' ? message : JSON.stringify(message)
        });
    },
    warning(message: string) {
        Message.warning({
            closable: true,
            content: message + ''
        });
    },
    error
}