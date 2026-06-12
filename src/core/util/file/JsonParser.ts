/**
 * 自定义JSON解析器，处理BigInt和长整型数据精度问题
 * 支持ES2023的BigInt类型
 */
import MessageUtil from "@/utils/model/MessageUtil";

// 长整型数据的最大安全值
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

/**
 * 检查数字是否超出JavaScript安全整数范围
 */
function isUnsafeInteger(num: number): boolean {
  return num > MAX_SAFE_INTEGER || num < MIN_SAFE_INTEGER;
}

/**
 * 检查字符串是否为大整数
 */
function isBigIntString(str: string): boolean {
  return /^-?\d{16,}$/.test(str);
}

/**
 * 自定义JSON解析器，处理BigInt数据
 * @param text JSON字符串
 * @returns 解析后的对象
 */
export function parseJsonWithBigIntSupport<T extends Record<string, any>>(text: string): T {
  try {
    const preprocessed = preprocessBigIntNumbers(text);

    return JSON.parse(preprocessed, (_key, value) => {
      if (typeof value === "string" && isBigIntString(value)) {
        return BigInt(value);
      }

      if (typeof value === "number" && isUnsafeInteger(value)) {
        return BigInt(Math.trunc(value));
      }

      return value;
    });
  } catch (e) {
    MessageUtil.warning("JSON解析出现问题，数值类型精度可能丢失", e);
    return JSON.parse(text);
  }
}

/**
 * 预处理JSON字符串，将大整数转换为字符串格式
 * 使用字符级状态扫描器追踪是否在字符串上下文中，避免误替换字符串内容
 * @param text JSON字符串
 * @returns 预处理后的字符串
 */
function preprocessBigIntNumbers(text: string): string {
  let result = "";
  let inString = false;
  let i = 0;
  const len = text.length;

  while (i < len) {
    const ch = text[i];

    if (inString) {
      // 字符串内：原样复制，处理转义
      result += ch;
      i++;
      if (ch === "\\" && i < len) {
        // 跳过转义后的字符（包括 \"）
        result += text[i];
        i++;
      } else if (ch === '"') {
        // 字符串结束
        inString = false;
      }
    } else {
      if (ch === '"') {
        // 字符串开始
        inString = true;
        result += ch;
        i++;
      } else if (ch === "-" || (ch >= "0" && ch <= "9")) {
        // 尝试匹配一个完整的数字：可选负号 + 整数部分
        const start = i;
        if (ch === "-") i++;
        while (i < len && text[i] >= "0" && text[i] <= "9") i++;
        const intPart = text.slice(start, i);
        const digitCount = ch === "-" ? intPart.length - 1 : intPart.length;

        // 检查是否是小数或科学计数法的一部分
        const isDecimalOrScientific = i < len && (text[i] === "." || text[i] === "e" || text[i] === "E");

        if (digitCount >= 16 && !isDecimalOrScientific) {
          // 进一步检查前一个非空格字符：
          // 如果是 '.' 或 'e'/'E'，说明这是小数尾数或科学计数法指数，不应包裹
          // 如果是 \w（字母/数字/下划线），说明这是标识符的一部分，不应包裹
          let prevIdx = start - 1;
          while (prevIdx >= 0 && text[prevIdx] === " ") prevIdx--;
          if (
            prevIdx >= 0 &&
            (text[prevIdx] === "." || text[prevIdx] === "e" || text[prevIdx] === "E" || /\w/.test(text[prevIdx]))
          ) {
            // 不是独立的大整数，保持原样
            result += intPart;
          } else {
            // 真正的独立大整数，包裹为字符串
            result += '"' + intPart + '"';
          }
        } else {
          result += intPart;
        }
      } else {
        result += ch;
        i++;
      }
    }
  }

  return result;
}

/**
 * 自定义JSON序列化器，处理BigInt数据
 * @param obj 要序列化的对象
 * @returns JSON字符串
 */
export function stringifyJsonWithBigIntSupport(obj: any): string {
  return JSON.stringify(obj, (_key, value) => {
    // 处理BigInt类型
    if (typeof value === "bigint") {
      return value.toString();
    }

    // 处理数字类型的不安全整数
    if (typeof value === "number" && isUnsafeInteger(value)) {
      return BigInt(Math.trunc(value)).toString();
    }

    // 处理字符串形式的大整数
    if (typeof value === "string" && isBigIntString(value)) {
      return value;
    }

    return value;
  });
}

/**
 * 安全的数值转换函数，支持BigInt
 * @param value 要转换的值
 * @returns 转换后的数值、BigInt或字符串
 */
export function safeNumberConversion(value: any): any {
  if (typeof value === "bigint") {
    return value;
  }

  if (typeof value === "string" && /^-?\d+$/.test(value)) {
    // 检查是否为大整数
    if (isBigIntString(value)) {
      return BigInt(value);
    }

    const num = Number(value);
    if (isUnsafeInteger(num)) {
      return BigInt(value);
    }
    return num;
  }

  if (typeof value === "number" && isUnsafeInteger(value)) {
    return BigInt(Math.trunc(value));
  }

  return value;
}

/**
 * 递归处理对象中的BigInt和长整型数据
 * @param obj 要处理的对象
 * @returns 处理后的对象
 */
export function processBigIntData(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(processBigIntData);
  }

  if (typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = processBigIntData(value);
    }
    return result;
  }

  return safeNumberConversion(obj);
}

/**
 * 将BigInt转换为适合导出的格式
 * @param obj 包含BigInt的对象
 * @returns 转换后的对象（BigInt转为字符串）
 */
export function convertBigIntForExport(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "bigint") {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntForExport);
  }

  if (typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertBigIntForExport(value);
    }
    return result;
  }

  return obj;
}
