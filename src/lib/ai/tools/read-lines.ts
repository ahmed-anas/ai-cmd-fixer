import { z } from "zod";
import fs from "fs/promises";
import { DynamicStructuredTool } from "langchain/tools";

const updateCounters = (line: string, counters: { openCurly: number, openSquare: number, openParen: number }) => {
  for (const char of line) {
    if (char === '{') counters.openCurly++;
    else if (char === '}') counters.openCurly--;
    else if (char === '[') counters.openSquare++;
    else if (char === ']') counters.openSquare--;
    else if (char === '(') counters.openParen++;
    else if (char === ')') counters.openParen--;
  }
};

export const ReadLinesTool = () => new DynamicStructuredTool({
  name: "read-lines",
  description: "Reads lines from a file. Print line number in front of each line. May read more lines than given as input.",
  schema: z.object({
    filePath: z.string().describe("the file path of the file to read."),
    startLine: z.number().describe("the line number to start reading from."),
    endLine: z.number().describe("the line number to stop reading (inclusive).")
  }),
  func: async ({ filePath, startLine, endLine }) => {
    const lines = (await fs.readFile(filePath, 'utf-8')).split('\n');
    const counters = { openCurly: 0, openSquare: 0, openParen: 0 };

    let adjustedStartLine = startLine;
    let adjustedEndLine = endLine;

    // Adjust startLine
    for (let i = startLine - 1; i >= 0; i--) {
      updateCounters(lines[i], counters);
      if (Object.values(counters).some(count => count < 0)) {
        adjustedStartLine = i - 1;
      } else if (Object.values(counters).every(count => count >= 0)) {
        break;
      }
    }

    // Adjust endLine
    for (let i = adjustedStartLine - 1; i < lines.length && i <= adjustedEndLine; i++) {
      updateCounters(lines[i], counters);
      if (Object.values(counters).some(count => count !== 0)) {
        adjustedEndLine = i + 1;
      }
    }

    const outputLines = lines.slice(adjustedStartLine - 1, adjustedEndLine).map((line, index) => `${adjustedStartLine + index}: ${line}`);
    return outputLines.join('\n');
  },
  returnDirect: false
});
