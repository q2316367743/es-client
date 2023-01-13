import Optional from "@/utils/Optional";
import {ElMessage} from "element-plus";

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
            if (typeof message === 'string') {
                message = Optional.ofNullable(message).orElse("断言表达式为真");
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message
                })
                throw new Error(message);
            }else if (typeof message === 'function'){
                message();
                throw new Error('断言表达式为真');
            }else {
                throw new Error('断言表达式为真');
            }
        }
    },


    /**
     * 断言表达式为假
     * @param express 表达式
     * @param message 为真时提示消息
     */
    isFalse(express: boolean, message?: string | (() => void)) {
        if (express) {
            if (typeof message === 'string') {
                message = Optional.ofNullable(message).orElse("断言表达式为假");
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message
                })
                throw new Error(message);
            }else if (typeof message === 'function'){
                message();
                throw new Error('断言表达式为假');
            }else {
                throw new Error('断言表达式为假');
            }
        }
    }

}