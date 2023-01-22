import Optional from "@/utils/Optional";
import {ElMessage} from "element-plus";

function showMessage(error: string, message?: string | (() => void), callback?: () => void) {
    if (callback) {
        message = Optional.ofNullable(message).orElse(error);
        ElMessage({
            showClose: true,
            type: 'error',
            message: message as string
        });
        // 异常抛出前进行回调
        callback();
        throw new Error(message as string);
    }
    if (typeof message === 'string') {
        message = Optional.ofNullable(message).orElse(error);
        ElMessage({
            showClose: true,
            type: 'error',
            message
        })
        throw new Error(message);
    } else if (typeof message === 'function') {
        message();
        throw new Error(error);
    } else {
        throw new Error(error);
    }
}

/**
 * 断言对象不能undefined
 */
function notNull(express: any): void;
/**
 * 断言对象不能undefined
 * @param express 表达式
 * @param message 为undefined时提示
 */
function notNull(express: any, message: string): void;
/**
 * 断言对象不能undefined
 * @param express 对象
 * @param callback 为undefined时回调
 */
function notNull(express: any, callback: () => void): void;
function notNull(express: any, message: string, callback: () => void): void;
function notNull(object: any, message?: string | (() => void), callback?: () => void) {
    if (object === 'undefined') {
        showMessage("断言对象不能undefined", message, callback);
    }
}

/**
 * 断言
 */
export default {

    /**
     * 断言表达式为真
     * @param express 表达式
     * @param message 为假时提示消息
     */
    isTrue(express: boolean, message?: string | (() => void)) {
        if (!express) {
            showMessage("断言表达式为真", message);
        }
    },

    /**
     * 断言表达式为假
     * @param express 表达式
     * @param message 为真时提示消息
     */
    isFalse(express: boolean, message?: string | (() => void)) {
        if (express) {
            showMessage("断言表达式为假", message);
        }
    },

    notNull

}