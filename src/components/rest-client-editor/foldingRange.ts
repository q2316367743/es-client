import * as monaco from "monaco-editor";

const HTTP_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]);

function isHeaderLine(line: string): boolean {
  line = line.trim();
  if (!line || line.startsWith("#")) return false;
  // Header: key: value (no space before colon, at least one after)
  return /^[^:\s]+:\s/.test(line);
}

function findRequestBodyStart(lines: string[], requestStart: number, requestEnd: number): number {
  let i = requestStart + 1;
  // Skip headers and empty lines
  while (i <= requestEnd) {
    const line = lines[i].trim();
    if (line === "" || line.startsWith("#") || isHeaderLine(lines[i])) {
      i++;
    } else {
      return i; // first non-header, non-empty, non-comment line
    }
  }
  return -1;
}

function getBracketFoldingRanges(
  lines: string[],
  startLine: number,
  endLine: number
): monaco.languages.FoldingRange[] {
  const ranges: monaco.languages.FoldingRange[] = [];
  const stack: { char: string; line: number }[] = [];

  for (let i = startLine; i <= endLine; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === "{" || ch === "[") {
        stack.push({ char: ch, line: i });
      } else if (ch === "}" || ch === "]") {
        if (stack.length === 0) continue; // unmatched

        const top = stack[stack.length - 1];
        const matches = (ch === "}" && top.char === "{") || (ch === "]" && top.char === "[");
        if (matches) {
          stack.pop();
          // Only create folding range if it spans multiple lines
          if (i > top.line) {
            ranges.push({
              start: top.line + 1, // 1-based
              end: i + 1, // 1-based
              kind: monaco.languages.FoldingRangeKind.Region
            });
          }
        } else {
          // Mismatched bracket: clear stack? or ignore.
          // For simplicity, we just pop until match or empty (optional)
          // Here we just ignore and continue
        }
      }
    }
  }

  return ranges;
}

/**
 * 实现代码折叠
 */
export const restFoldingRangeProvider: monaco.languages.FoldingRangeProvider = {
  provideFoldingRanges: (model) => {
    const lineCount = model.getLineCount();
    const lines: string[] = [];
    for (let i = 1; i <= lineCount; i++) {
      lines.push(model.getLineContent(i));
    }

    const ranges: monaco.languages.FoldingRange[] = [];
    const requestBlocks: { start: number; end: number }[] = [];

    // Step 1: Find all request blocks
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (line.startsWith("#") || line === "") {
        i++;
        continue;
      }

      const parts = line.split(/\s+/);
      if (parts.length >= 2 && HTTP_METHODS.has(parts[0])) {
        const blockStart = i;
        i++;
        // Find end of this request block (next request or EOF)
        while (i < lines.length) {
          const nextLine = lines[i].trim();
          if (nextLine === "") {
            i++;
            continue;
          }
          if (nextLine.startsWith("#")) {
            i++;
            continue;
          }
          const nextParts = nextLine.split(/\s+/);
          if (nextParts.length >= 2 && HTTP_METHODS.has(nextParts[0])) {
            break; // next request starts
          }
          i++;
        }
        requestBlocks.push({ start: blockStart, end: i - 1 });
      } else {
        i++;
      }
    }

    // If no blocks found, try to treat whole file as one block (optional)
    if (requestBlocks.length === 0 && lines.length > 0) {
      requestBlocks.push({ start: 0, end: lines.length - 1 });
    }

    // Step 2: Add folding for each request block + JSON body
    for (const block of requestBlocks) {
      const { start, end } = block;
      if (end > start) {
        ranges.push({
          start: start + 1,
          end: end + 1,
          kind: monaco.languages.FoldingRangeKind.Region
        });
      }

      // Find request body
      const bodyStart = findRequestBodyStart(lines, start, end);
      if (bodyStart !== -1) {
        const firstBodyLine = lines[bodyStart].trim();
        if (firstBodyLine.startsWith("{") || firstBodyLine.startsWith("[")) {
          const jsonRanges = getBracketFoldingRanges(lines, bodyStart, end);
          ranges.push(...jsonRanges);
        }
      }
    }

    return ranges;
  }
};
