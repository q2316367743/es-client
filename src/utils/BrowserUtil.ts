import MessageUtil from "@/utils/MessageUtil";

export default {

    /**
     * 拷贝
     * @param content 内容
     * @param showMessage 显示消息，默认显示
     */
    copy(content: string, showMessage: boolean = true) {
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
        if (showMessage) {
            MessageUtil.success('已成功复制到剪切板');
        }
    },

    /**
     * 下载
     * @param data 内容
     * @param fileName 文件名
     * @param mineType 文件类型
     */
    download(data: string, fileName: string, mineType: string) {
        // 创建 blob
        let blob = new Blob([data], {type: mineType});
        // 创建 href 超链接，点击进行下载
        window.URL = window.URL || window.webkitURL;
        let href = URL.createObjectURL(blob);
        let downA = document.createElement("a");
        downA.href = href;
        downA.download = fileName;
        downA.click();
        // 销毁超连接
        window.URL.revokeObjectURL(href);
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