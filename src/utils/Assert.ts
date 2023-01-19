import Optional from "@/utils/Optional";
import {ElMessage} from "element-plus";

function showMessage(error: string, message?: string | (() => void)) {
    if (typeof message === 'string') {
        message = Optional.ofNullable(message).orElse(error);
        ElMessage({
            showClose: true,
            type: 'error',
            message
        })
        throw new Error(message);
    }else if (typeof message === 'function'){
        message();
        throw new Error(error);
    }else {
        throw new Error(error);
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

    /**
     * 断言对象不能undefined
     * @param object 对象
     * @param message 为真时提示消息
     */
    notNull(object: any, message?: string | (() => void)) {
        if (object === 'undefined') {
            showMessage("断言对象不能undefined", message);
        }
    },

}