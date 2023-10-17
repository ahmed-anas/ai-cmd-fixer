import { z } from "zod";
import { DynamicStructuredTool } from "langchain/tools";

export const EndProcessTool = () => new DynamicStructuredTool({
    name: "end-process",
    description: "Execute to conclude the execution pipeline, confirming that the command has been successfully executed.",
    schema: z.object({
        summary: z.string().describe("A description of the issue followed by all the operations and fixes performed. The description should be precise but detailed. Use bullet points where necessary."),
    }),
    func: async ({ summary }) => {
        return summary;
    },
    returnDirect: true
});
