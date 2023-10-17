import { z } from "zod";
import fs from "fs/promises";
import { DynamicStructuredTool } from "langchain/tools";

export const UpdateLinesTool = () => new DynamicStructuredTool({
    name: "update-lines",
    description: "Updates specified line range in a text file with new content.",
    schema: z.object({
        filePath: z.string().describe("Path to target text file."),
        startLine: z.number().describe("Start line number, inclusive. Starts from 1."),
        endLine: z.number().describe("End line number, inclusive."),
        content: z.string().describe("Content to write in the specified lines.")
    }),
    func: async ({ filePath, startLine, endLine, content }) => {
        const lines = (await fs.readFile(filePath, 'utf-8')).split('\n');
        lines.splice(startLine - 1, endLine - startLine + 1, content);
        await fs.writeFile(filePath, lines.join('\n'));
        return "Lines updated successfully.";
    },
    returnDirect: false
});
