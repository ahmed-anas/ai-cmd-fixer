import { z } from "zod";
import fs from "fs/promises";
import { DynamicStructuredTool } from "langchain/tools";

export const EndProcessTool = () => new DynamicStructuredTool({
    name: "end-process",
    description: "Triggered when everything is good and the command is running successfully.",
    schema: z.object({
        summary: z.string().describe("A description of the issue followed by all the operations and fixes performed."),
    }),
    func: async ({ summary }) => {
        return summary;
    },
    returnDirect: true
});
