import {ElMessage} from "element-plus";
import Optional from "@/utils/Optional";

function success(message: string): void;
function success(message: string, callback: () => void): void;
function success(message: string, callback?: () => void): void {
    ElMessage({
        showClose: true,
        type: "success",
        message: message + ''
    });
    callback && callback();
}

function error(message: string): void;
function error(message: string, e: Error): void;
function error(message: string, e: Error, callback: () => void): void;
function error(message: string, e?: Error, callback?: () => void): void {
    ElMessage({
        showClose: true,
        type: "error",
        message: Optional.ofNullable(e).map(e => `${message}，${e.message}`).orElse(message)
    });
    console.error(e);
    callback && callback();
}

export default {

    success,
    info(message: string) {
        ElMessage({
            showClose: true,
            type: "info",
            message
        })
    },
    warning(message: string) {
        ElMessage({
            showClose: true,
            type: "warning",
            message
        })
    },
    error
}