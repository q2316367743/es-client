import {ElMessage} from "element-plus";

export default {

    copy(content: string) {
        // content为要复制的内容
        // 创建元素用于复制
        const ele = document.createElement('textarea');
        // 设置元素内容
        ele.value = content;
        // 将元素插入页面进行调用
        document.body.appendChild(ele);
        // 复制内容
        ele.select();
        // 将内容复制到剪贴板
        document.execCommand('copy');
        // 删除创建元素
        document.body.removeChild(ele);
        ElMessage({
            showClose: true,
            type: 'success',
            message: '已成功复制到剪切板'
        });
    },

    /**
     * Uint8Array数组转字符串
     * @param uint8Array Uint8Array数组
     */
    uint8ArrayToString(uint8Array: Uint8Array): string {
        let dataString = "";
        for (let i = 0; i < uint8Array.length; i++) {
            dataString += String.fromCharCode(uint8Array[i]);
        }
        return dataString

    }
}