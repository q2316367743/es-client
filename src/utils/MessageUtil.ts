import {Message} from '@arco-design/web-vue';
import Optional from "@/utils/Optional";
import NotificationUtil from "@/utils/NotificationUtil";

function success(message: string): void;
function success(message: string, callback: () => void): void;
function success(message: string, callback?: () => void): void {
    Message.success({
        closable: true,
        content: message + ''
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
    }else {
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
    info(message: string) {
        Message.info({
            closable: true,
            content: message + ''
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