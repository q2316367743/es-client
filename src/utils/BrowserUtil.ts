/**
 * 下载
 * @param data 内容
 * @param fileName 文件名
 * @param mineType 文件类型
 */
export function download(data: string | ArrayBuffer | Blob, fileName: string, mineType: string) {
    // 创建 blob
    let blob = data instanceof Blob ? data : new Blob([data], {type: mineType});
    // 创建 href 超链接，点击进行下载
    window.URL = window.URL || window.webkitURL;
    let href = URL.createObjectURL(blob);
    let downA = document.createElement("a");
    downA.href = href;
    downA.download = fileName;
    downA.click();
    // 销毁超连接
    window.URL.revokeObjectURL(href);
}

/**
 * 拷贝文本到剪贴板
 * @param content 要复制的文本内容
 * @returns Promise<boolean> 是否成功复制
 */
export async function copyText(content: string): Promise<boolean> {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (err) {
      console.warn('使用 Clipboard API 复制失败，尝试降级方案:', err);
    }
  }

  // 降级方案：使用 document.execCommand('copy')
  const ele = document.createElement('textarea');
  ele.value = content;
  ele.setAttribute('readonly', '');
  ele.style.position = 'absolute';
  ele.style.left = '-9999px';
  document.body.appendChild(ele);

  const selection = document.getSelection();
  const selected = selection?.rangeCount ? selection.getRangeAt(0) : null;

  ele.select();
  ele.setSelectionRange(0, ele.value.length);

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    console.error('降级复制方案失败:', err);
  }

  document.body.removeChild(ele);

  // 恢复用户原有的选区（如果存在）
  if (selected && selection) {
    selection.removeAllRanges();
    selection.addRange(selected);
  }

  return success;
}

export function downloadByUrl(url: string, fileName?: string) {
    let downA = document.createElement("a");
    downA.href = url;
    let index = url.lastIndexOf("/");
    if (fileName) {
        downA.download = fileName;
    } else {
        downA.download = url.substring(index + 1, url.length);
    }
    downA.click();
}

/**
 * Uint8Array数组转字符串
 * @param uint8Array Uint8Array数组
 */
export function uint8ArrayToString(uint8Array: Uint8Array): string {
    let dataString = "";
    for (let i = 0; i < uint8Array.length; i++) {
        dataString += String.fromCharCode(uint8Array[i]);
    }
    return dataString

}

export function svg2png(svg: SVGSVGElement): Promise<string> {
    // 创建一个Canvas元素
    const canvas = document.createElement('canvas');
    // 获取Canvas上下文对象
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return Promise.reject("创建canvas对象错误");
    }
    // 获取SVG的宽高
    const svgRect = svg.getBoundingClientRect();
    // 设置Canvas的宽高与SVG相同
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;
    // 创建一个新的Image对象，用于绘制SVG
    const svgImage = new Image();
    // 将SVG转为Base64编码的data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;
    return new Promise<string>((resolve, reject) => {
        // 在Image对象中加载SVG
        svgImage.onload = () => {
            // 将SVG绘制到Canvas上
            ctx.drawImage(svgImage, 0, 0);
            // 将Canvas转为图片
            resolve(canvas.toDataURL('image/png'));
        };
        svgImage.onerror = e => reject(e);
        // 加载SVG
        svgImage.src = svgUrl;
    })
}

export function downloadByBase64(base64: string, fileName?: string) {
    let byteCharacters = atob(
        base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
    );
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let blob = new Blob([byteArray], {
        type: undefined,
    });
    let aLink = document.createElement("a");
    aLink.download = fileName || "图片名称.png"; //这里写保存时的图片名称
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
}

/**
 * 美化数据单位
 *
 * @param {number} value 需要美化的值
 */
export function prettyDataUnit(value: number) {
    let gb = 1024 * 1024 * 1024.0;
    if (value > gb) {
        let temp = value / gb;
        return temp.toFixed(2) + 'GB';
    }
    let mb = 1024 * 1024.0;
    if (value > mb) {
        let temp = value / mb;
        return temp.toFixed(2) + 'MB';
    }
    let b = 1024.0;
    if (value > b) {
        let temp = value / b;
        return temp.toFixed(2) + 'KB';
    }
    return value + 'B';

}

export function generateUUID(): string {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function pathJoin(...paths: string[]): string {
    return paths.join("/")
}
