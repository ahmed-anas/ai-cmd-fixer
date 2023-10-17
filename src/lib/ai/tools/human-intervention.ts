import { z } from "zod";
import fs from "fs/promises";
import { DynamicStructuredTool } from "langchain/tools";
import { UserInteraction } from "../../user-interaction";

export const HumanInterventionTool = () => {
    return new DynamicStructuredTool({
        name: "human-intervention",
        description: "Initiates a user interaction for query clarification. Use this tool when ambiguity arises. Do not hesistate to use it.",
        schema: z.object({
            freeText: z.string().describe("Unstructured text that serves as the basis to pose clarification questions.")
        }),
        func: async ({ freeText }) => {
            return await UserInteraction.get().getInput(`The AI needs clarification: ${freeText}`);
        },
        returnDirect: false
    });
}
