import { z } from "zod";
import fs from "fs/promises";
import { DynamicStructuredTool } from "langchain/tools";
import { readLines } from "./read-lines";

export const UpdateLinesTool = () => new DynamicStructuredTool({
    name: "update-lines",
    description: "Updates specified line range in a text file with new content. Returns a subset of the file with the updated lines.",
    schema: z.object({
        filePath: z.string().describe("Path to target text file."),
        lineToStartWritingFrom: z.number().describe("Start line number, inclusive. Starts from 1."),
        lineToEndWritingTo: z.number().describe("End line number, inclusive."),
        newContent: z.string().describe("Content to write in the specified lines. Be sure to prefix with the right number of spaces so that indentation is not disturbed.")
    }),
    func: async ({ filePath, lineToStartWritingFrom: startLine, lineToEndWritingTo: endLine, newContent }) => {
        console.log(` - Updating ${filePath}:${startLine}-${endLine}`);
        console.log('-------------');
        console.log(newContent);
        console.log('-------------');
        const lines = (await fs.readFile(filePath, 'utf-8')).split('\n');
        lines.splice(startLine - 1, endLine - startLine + 1, newContent);
        await fs.writeFile(filePath, lines.join('\n'));

        
        return "Lines updated successfully.";
        // return "Lines updated successfully." + "\n" + readLines(filePath, startLine, endLine);
    },
    returnDirect: false
});
