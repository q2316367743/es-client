/**
 * 格式化 JSON 字符串，保留 Long 类型的原始字符串表示，避免类型丢失。
 * 通过纯字符串操作实现，防止解析后再序列化导致的精度问题。
 * 使用栈来追踪嵌套的 JSON 结构（对象 {} 和数组 []），使逻辑更清晰。
 * 精确处理字符串值内部的逗号、冒号等字符，避免错误换行。
 *
 * @param jsonString - 需要格式化的 JSON 字符串。
 * @param indent - 缩进空格数，默认为 2。
 * @returns 格式化后的 JSON 字符串。
 */
export function formatJsonString(jsonString: string, indent: number = 2): string {
  if (!jsonString || typeof jsonString !== "string") {
    return jsonString;
  }

  let formatted = "";
  const indentString = " ".repeat(indent);
  const stack: ("{" | "[")[] = []; // 栈用于追踪当前嵌套的结构

  let inString = false; // 是否在双引号字符串内
  let escapeNext = false; // 下一个字符是否被转义

  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString[i];

    // 处理转义字符
    if (escapeNext) {
      formatted += char;
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      formatted += char;
      escapeNext = true;
      continue;
    }

    // 处理字符串的开始和结束
    if (char === '"') {
      formatted += char;
      inString = !inString;
      continue;
    }

    // 如果在字符串内，直接添加字符，不做任何格式化处理
    if (inString) {
      formatted += char;
      continue;
    }

    // --- 以下处理均在字符串外 ---

    switch (char) {
      case " ":
      case "\n":
      case "\r":
      case "\t":
        // 在字符串外的空白字符可以忽略
        break;
      case "{":
        formatted += char;
        stack.push("{");
        formatted += "\n" + indentString.repeat(stack.length);
        break;
      case "[":
        formatted += char;
        stack.push("[");
        formatted += "\n" + indentString.repeat(stack.length);
        break;
      case "}":
        // 弹出栈顶，表示离开一个对象
        if (stack.length > 0 && stack[stack.length - 1] === "{") {
          stack.pop();
        }
        formatted += "\n" + indentString.repeat(stack.length) + char;
        break;
      case "]":
        // 弹出栈顶，表示离开一个数组
        if (stack.length > 0 && stack[stack.length - 1] === "[") {
          stack.pop();
        }
        formatted += "\n" + indentString.repeat(stack.length) + char;
        break;
      case ",":
        // 只有在字符串外的逗号才是分隔符
        formatted += char + "\n" + indentString.repeat(stack.length);
        // 跳过原始字符串中逗号后的空格，使格式更整洁
        if (jsonString[i + 1] === " ") {
          i++;
        }
        break;
      case ":":
        // 只有在字符串外的冒号才是 key-value 分隔符
        formatted += char + " "; // 在 key 和 value 之间添加空格
        break;
      default:
        formatted += char;
        break;
    }
  }

  return formatted;
}

/**
 * 使用栈算法解析JSON字符串并根据JSONPath提取内容
 * @param jsonString - JSON字符串
 * @param jsonPath - JSONPath表达式，如 $.a.b.c 或 $.a.b[0].c
 * @returns 匹配路径的内容字符串，未找到则返回null
 */
export function extractByJsonPath(jsonString: string, jsonPath: string): string | null {
  if (!jsonString || !jsonPath || !jsonPath.startsWith("$.")) {
    return null;
  }

  try {
    // 解析JSONPath为路径数组
    const path = parseJsonPath(jsonPath);
    if (path.length === 0) return null;

    // 使用递归下降解析器
    const result = parseJson(jsonString, 0);
    if (!result) return null;

    // 在解析结果中查找路径
    return findValueByPath(result.value, result.raw, path);
  } catch {
    return null;
  }

  function parseJsonPath(jsonPath: string): Array<string | number> {
    const segments: Array<string | number> = [];
    const parts = jsonPath.slice(2).split(".");

    for (const part of parts) {
      const arrayMatch = part.match(/^([^[]+)\[(\d+)\]$/);
      if (arrayMatch) {
        segments.push(arrayMatch[1]); // key
        segments.push(parseInt(arrayMatch[2])); // index
      } else if (part) {
        segments.push(part);
      }
    }

    return segments;
  }

  function parseJson(json: string, start: number): { value: any; raw: string; end: number } | null {
    let pos = start;

    // 跳过空白字符
    while (pos < json.length && /\s/.test(json[pos])) pos++;
    if (pos >= json.length) return null;

    // const startPos = pos;
    const char = json[pos];

    if (char === '"') {
      // 字符串
      return parseString(json, pos);
    } else if (char === "{") {
      // 对象
      return parseObject(json, pos);
    } else if (char === "[") {
      // 数组
      return parseArray(json, pos);
    } else if (char === "t" || char === "f" || char === "n" || /[0-9-]/.test(char)) {
      // 布尔值、null或数字
      return parsePrimitive(json, pos);
    }

    return null;
  }

  function parseString(json: string, start: number): { value: string; raw: string; end: number } {
    let pos = start + 1; // 跳过开始的引号
    const rawStart = start;
    let value = "";
    let escape = false;

    while (pos < json.length) {
      const char = json[pos];

      if (escape) {
        value += char;
        escape = false;
      } else if (char === "\\") {
        value += char;
        escape = true;
      } else if (char === '"') {
        pos++; // 跳过结束引号
        break;
      } else {
        value += char;
      }
      pos++;
    }

    return {
      value,
      raw: json.slice(rawStart, pos),
      end: pos
    };
  }

  function parseObject(
    json: string,
    start: number
  ): { value: Record<string, any>; raw: string; end: number } | null {
    let pos = start + 1; // 跳过 '{'
    const rawStart = start;
    const obj: Record<string, any> = {};
    const rawParts: Record<string, string> = {};

    // 跳过空白
    while (pos < json.length && /\s/.test(json[pos])) pos++;

    // 空对象
    if (pos < json.length && json[pos] === "}") {
      return {
        value: obj,
        raw: json.slice(rawStart, pos + 1),
        end: pos + 1
      };
    }

    while (pos < json.length) {
      // 跳过空白
      while (pos < json.length && /\s/.test(json[pos])) pos++;

      if (pos >= json.length) break;
      if (json[pos] === "}") {
        pos++;
        break;
      }

      // 解析key
      if (json[pos] !== '"') break;
      const keyResult = parseString(json, pos);
      pos = keyResult.end;

      // 跳过空白和冒号
      while (pos < json.length && /\s/.test(json[pos])) pos++;
      if (pos >= json.length || json[pos] !== ":") break;
      pos++; // 跳过 ':'
      while (pos < json.length && /\s/.test(json[pos])) pos++;

      // 解析value
      const valueResult = parseJson(json, pos);
      if (!valueResult) break;
      pos = valueResult.end;

      obj[keyResult.value] = valueResult.value;
      rawParts[keyResult.value] = valueResult.raw;

      // 跳过空白
      while (pos < json.length && /\s/.test(json[pos])) pos++;

      if (pos < json.length && json[pos] === ",") {
        pos++; // 跳过逗号
      } else if (pos < json.length && json[pos] === "}") {
        pos++;
        break;
      } else {
        break;
      }
    }

    return {
      value: obj,
      raw: json.slice(rawStart, pos),
      end: pos
    };
  }

  function parseArray(
    json: string,
    start: number
  ): { value: any[]; raw: string; end: number } | null {
    let pos = start + 1; // 跳过 '['
    const rawStart = start;
    const arr: any[] = [];
    const rawParts: string[] = [];

    // 跳过空白
    while (pos < json.length && /\s/.test(json[pos])) pos++;

    // 空数组
    if (pos < json.length && json[pos] === "]") {
      return {
        value: arr,
        raw: json.slice(rawStart, pos + 1),
        end: pos + 1
      };
    }

    while (pos < json.length) {
      // 跳过空白
      while (pos < json.length && /\s/.test(json[pos])) pos++;

      if (pos >= json.length) break;
      if (json[pos] === "]") {
        pos++;
        break;
      }

      // 解析元素
      const elementResult = parseJson(json, pos);
      if (!elementResult) break;
      pos = elementResult.end;

      arr.push(elementResult.value);
      rawParts.push(elementResult.raw);

      // 跳过空白
      while (pos < json.length && /\s/.test(json[pos])) pos++;

      if (pos < json.length && json[pos] === ",") {
        pos++; // 跳过逗号
      } else if (pos < json.length && json[pos] === "]") {
        pos++;
        break;
      } else {
        break;
      }
    }

    return {
      value: arr,
      raw: json.slice(rawStart, pos),
      end: pos
    };
  }

  function parsePrimitive(json: string, start: number): { value: any; raw: string; end: number } {
    let pos = start;
    const startPos = start;

    while (pos < json.length && !/[,\]}]/.test(json[pos]) && !/\s/.test(json[pos])) {
      pos++;
    }

    const raw = json.slice(startPos, pos);
    let value: any;

    if (raw === "true") {
      value = true;
    } else if (raw === "false") {
      value = false;
    } else if (raw === "null") {
      value = null;
    } else {
      // 数字或其他值，保持为字符串以避免精度丢失
      value = raw;
    }

    return { value, raw, end: pos };
  }

  function findValueByPath(obj: any, objRaw: string, path: Array<string | number>): string | null {
    if (path.length === 0) return objRaw;

    const [head, ...tail] = path;

    if (typeof head === "string") {
      // 对象属性
      if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
        return null;
      }

      if (!(head in obj)) {
        return null;
      }

      // 重新解析获取该属性的原始值
      const childRaw = getObjectPropertyRaw(objRaw, head);
      if (childRaw === null) return null;

      return findValueByPath(obj[head], childRaw, tail);
    } else if (typeof head === "number") {
      // 数组索引
      if (!Array.isArray(obj) || head < 0 || head >= obj.length) {
        return null;
      }

      // 重新解析获取该元素的原始值
      const childRaw = getArrayElementRaw(objRaw, head);
      if (childRaw === null) return null;

      return findValueByPath(obj[head], childRaw, tail);
    }

    return null;
  }

  function getObjectPropertyRaw(objRaw: string, key: string): string | null {
    // 简化版本：重新解析对象来获取属性的原始值
    const parseResult = parseObject(objRaw, 0);
    if (!parseResult) return null;

    // 手动查找key对应的原始值
    let pos = 1; // 跳过 '{'
    while (pos < objRaw.length) {
      while (pos < objRaw.length && /\s/.test(objRaw[pos])) pos++;

      if (pos >= objRaw.length || objRaw[pos] === "}") break;

      // 解析key
      if (objRaw[pos] !== '"') break;
      const keyResult = parseString(objRaw, pos);
      pos = keyResult.end;

      // 跳过冒号
      while (pos < objRaw.length && /\s/.test(objRaw[pos])) pos++;
      if (pos >= objRaw.length || objRaw[pos] !== ":") break;
      pos++;
      while (pos < objRaw.length && /\s/.test(objRaw[pos])) pos++;

      // 解析值
      const valueResult = parseJson(objRaw, pos);
      if (!valueResult) break;
      pos = valueResult.end;

      if (keyResult.value === key) {
        return valueResult.raw;
      }

      // 跳过逗号
      while (pos < objRaw.length && /\s/.test(objRaw[pos])) pos++;
      if (pos < objRaw.length && objRaw[pos] === ",") {
        pos++;
      } else {
        break;
      }
    }

    return null;
  }

  function getArrayElementRaw(arrRaw: string, index: number): string | null {
    // 重新解析数组来获取元素的原始值
    let pos = 1; // 跳过 '['
    let currentIndex = 0;

    while (pos < arrRaw.length) {
      while (pos < arrRaw.length && /\s/.test(arrRaw[pos])) pos++;

      if (pos >= arrRaw.length || arrRaw[pos] === "]") break;

      const elementResult = parseJson(arrRaw, pos);
      if (!elementResult) break;
      pos = elementResult.end;

      if (currentIndex === index) {
        return elementResult.raw;
      }

      currentIndex++;

      // 跳过逗号
      while (pos < arrRaw.length && /\s/.test(arrRaw[pos])) pos++;
      if (pos < arrRaw.length && arrRaw[pos] === ",") {
        pos++;
      } else {
        break;
      }
    }

    return null;
  }
}

function _flattenObject(obj: unknown, prefix = ""): Record<string, string> {
  if (obj === null || obj === undefined) {
    return {};
  }

  // 基础类型（包括 bigint）或数组：直接转为字符串
  if (typeof obj !== "object" || Array.isArray(obj)) {
    const value = Array.isArray(obj) ? JSON.stringify(obj) : String(obj);
    return prefix ? { [prefix]: value } : {};
  }

  // 此时 obj 是非 null 的普通对象
  const result: Record<string, string> = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = (obj as Record<string, unknown>)[key];

      if (value === null || typeof value !== "object") {
        // 基础类型（含 null）
        result[newKey] = String(value);
      } else if (Array.isArray(value)) {
        // 数组转 JSON 字符串
        result[newKey] = JSON.stringify(value);
      } else {
        // 递归处理嵌套对象
        Object.assign(result, _flattenObject(value, newKey));
      }
    }
  }

  return result;
}

/**
 * 扁平化嵌套对象为单层对象。
 * - 对象嵌套使用点号连接键路径（如 {a: {b: "c"}} → {"a.b": "c"}）
 * - 数组直接转为 JSON 字符串（如 {a: [1,2,3]} → {"a": "[1,2,3]"}）
 * - 基础类型（包括 bigint）转为字符串
 *
 * @param obj - 要扁平化的对象
 * @returns 扁平化后的单层对象
 */
export function flattenObject(obj: unknown): Record<string, string> {
  return _flattenObject(obj);
}
