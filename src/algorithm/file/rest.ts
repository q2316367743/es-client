import { formatJsonString } from "./json";

/**
 * 定义解析后的请求对象结构
 */
export interface ParsedRequest {
  method: string; // HTTP 请求方法 (如 POST, GET)
  url: string; // 请求的 URL
  headers: Record<string, string>; // 可选的请求头键值对
  body?: string; // 请求体内容 (通常是 JSON 字符串)
}

/**
 * 解析符合特定格式的 REST 客户端请求字符串
 * 格式：
 * - 请求块由一个或多个空行分隔。
 * - 每个请求块的第一行是请求行：METHOD URL。
 * - 后续行可以是请求头（key: value）或以 // 开头的注释。
 * - 请求头之后是请求体，请求体也可以包含以 // 开头的注释行。
 * @param input - 包含一个或多个 REST 请求定义的原始字符串
 * @returns 解析后的 ParsedRequest 对象数组
 */
export function parseRestRequests(input: string): ParsedRequest[] {
  const requests: ParsedRequest[] = [];

  // 1. 按照双换行符分割成独立的请求块，并清理每个块前后的空白
  const blocks = input
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0); // 过滤掉空块

  // 2. 遍历每个请求块进行解析
  for (const block of blocks) {
    // 将请求块按行分割，并过滤掉注释行
    const nonCommentLines = block
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => !line.startsWith("//"));

    // 如果过滤注释后没有内容，则跳过
    if (nonCommentLines.length === 0) continue;

    // 3. 解析第一行获取请求方法和URL
    const firstLineParts = nonCommentLines[0].split(/\s+/);
    // 确保第一行至少包含方法和URL两部分
    if (firstLineParts.length < 2) {
      console.warn("警告: 跳过无效的请求块:", block);
      continue; // 如果格式不正确，跳过该块
    }
    const method = firstLineParts[0];
    // 将剩余部分重新组合为URL，以处理URL中可能存在的空格（虽然不常见）
    const url = firstLineParts.slice(1).join(" ");

    // 初始化当前请求的结果对象
    const result: ParsedRequest = { method, url, body: "", headers: {} };

    // 用于记录请求头解析结束的位置
    let headerLinesEndIndex = 1;

    // 4. 解析请求头 (可选)
    const headers: Record<string, string> = {};
    // 从第二行开始检查是否为请求头
    for (let i = 1; i < nonCommentLines.length; i++) {
      const line = nonCommentLines[i];

      // 检查行是否包含冒号 ':'，以此判断是否为请求头
      if (line.includes(":")) {
        const colonIndex = line.indexOf(":");
        // 提取键和值，并去除两端空白
        const key = line.substring(0, colonIndex).trim();
        headers[key] = line.substring(colonIndex + 1).trim();
        // 更新请求头结束的索引
        headerLinesEndIndex = i + 1;
      } else {
        // 如果不是请求头，则认为是请求体的开始
        break;
      }
    }

    // 如果解析到了请求头，则添加到结果对象中
    if (Object.keys(headers).length > 0) {
      result.headers = headers;
    }

    // 5. 解析请求体 (从请求头结束的位置开始，到块末尾)
    // 使用 '\n' 连接，以保留原始的多行格式 (例如 JSON)
    result.body = nonCommentLines.slice(headerLinesEndIndex).join("\n");

    // 5.1 如果是空字符串，则将其设置为 undefined
    if (result.body.trim() === "") result.body = undefined;

    // 6. 将解析好的请求对象加入结果数组
    requests.push(result);
  }

  return requests;
}

/**
 * 格式化 REST 客户端查询字符串
 * @param input - 原始的查询字符串
 * @returns 格式化后的查询字符串
 */
export function formatRestQuery(input: string): string {
  // 1. 按行分割整个输入
  const allLines = input.split("\n");

  // 2. 找到所有请求方法行的索引 (不区分大小写)
  const methodLineIndices: number[] = [];
  const methodRegex = /^\s*(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH|TRACE)\b/i;

  for (let i = 0; i < allLines.length; i++) {
    if (methodRegex.test(allLines[i])) {
      methodLineIndices.push(i);
    }
  }

  if (methodLineIndices.length === 0) {
    return ""; // 没有找到任何方法行
  }

  const formattedBlocks: string[] = [];

  // 3. 遍历每个方法行索引，分割出对应的块
  for (let i = 0; i < methodLineIndices.length; i++) {
    const startIndex = methodLineIndices[i];
    // 下一个块的开始索引就是下一个方法行的索引，如果没有就是输入末尾
    const endIndex = i + 1 < methodLineIndices.length ? methodLineIndices[i + 1] : allLines.length;

    // 提取当前块的所有行
    const blockLines = allLines.slice(startIndex, endIndex);

    if (blockLines.length === 0) continue;

    // 4. 解析当前块
    // 4.1 解析请求行 (第一行)
    const requestLineMatch = blockLines[0].trim().match(methodRegex);
    if (!requestLineMatch) continue; // 理论上不应该发生

    const method = requestLineMatch[1].toUpperCase(); // 统一转为大写
    // 重新分割并获取 URL 部分，确保处理方法和 URL 之间的多个空格
    const requestLineParts = blockLines[0].trim().split(/\s+/);
    const url = requestLineParts.slice(1).join(" ");

    const formattedLines: string[] = [`${method} ${url}`];

    // 4.2 处理后续行：headers 和 body
    let bodyStartIndex = blockLines.length; // 默认 body 从末尾开始

    // 从请求行之后开始查找 headers 和 body
    for (let k = 1; k < blockLines.length; k++) {
      // 从索引 1 开始
      const line = blockLines[k];
      const trimmedLine = line.trim();

      // 忽略所有空白行
      if (trimmedLine === "") {
        continue;
      }

      // 检查是否符合 header 格式 (key: value)
      const headerMatch = trimmedLine.match(/^([^:]+):(.*)$/);
      if (headerMatch) {
        // 是 header 行，格式化并添加
        const key = headerMatch[1].trim();
        const value = headerMatch[2].trim();
        formattedLines.push(`${key}: ${value}`);
      } else {
        // 不是 header 格式，说明是 body 的开始
        bodyStartIndex = k;
        break; // 找到 body 开始就停止查找 headers
      }
    }

    // 4.3 处理 body (从 bodyStartIndex 到末尾的所有非空行)
    if (bodyStartIndex < blockLines.length) {
      // 收集所有 body 行 (忽略空白行)
      const bodyLines = blockLines.slice(bodyStartIndex).filter((line) => line.trim() !== "");
      if (bodyLines.length > 0) {
        // 将 body 行连接
        const rawBody = bodyLines.join("\n");

        if (rawBody.trim() !== "") {
          // 尝试格式化 JSON
          const formattedBody = formatJsonString(rawBody, 2);
          formattedLines.push(formattedBody);
        }
      }
    }

    // 4.4 将格式化好的块添加到结果列表
    const finalBlock = formattedLines.join("\n");
    if (finalBlock.trim() !== "") {
      formattedBlocks.push(finalBlock);
    }
  }

  // 5. 使用两个换行符连接不同的查询块
  return formattedBlocks.join("\n\n");
}
