/**
 * 自定义JSON解析器，处理BigInt和长整型数据精度问题
 * 支持ES2023的BigInt类型
 */

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
  // 预处理：将可能的大整数用引号包围，避免精度丢失
  const preprocessed = text.replace(/:\s*(-?\d{16,})\b/g, ': "$1"');

  return JSON.parse(preprocessed, (_key, value) => {
    // 处理字符串形式的大整数
    if (typeof value === "string" && isBigIntString(value)) {
      return BigInt(value);
    }

    // 处理数字类型的不安全整数
    if (typeof value === "number" && isUnsafeInteger(value)) {
      return BigInt(Math.trunc(value));
    }

    return value;
  });
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
