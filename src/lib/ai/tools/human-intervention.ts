import { z } from "zod";
import fs from "fs/promises";
import { DynamicStructuredTool } from "langchain/tools";
import { UserInteraction } from "../../user-interaction";

export const HumanInterventionTool = () => {
    return new DynamicStructuredTool({
        name: "human-intervention",
        description: "Allows AI to ask clarifying questions to the human user.",
        schema: z.object({
            freeText: z.string().describe("Free text for AI to process and ask questions.")
        }),
        func: async ({ freeText }) => {
            return await UserInteraction.get().getInput(`The AI has a question: ${freeText}`);
        },
        returnDirect: false
    });
}