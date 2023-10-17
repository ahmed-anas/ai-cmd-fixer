import { z } from "zod";
import { DynamicStructuredTool } from "langchain/tools";
import { CLIExecutor } from "../../cli-executor";

export const RunCommandTool = (commandToExecute: string, directory: string) => {
    const cliExecutor: CLIExecutor = new CLIExecutor();

    return new DynamicStructuredTool({
        name: "run-command",
        description: "Executes initial console command to check for remaining errors.",
        schema: z.object({}),
        func: async () => {
            let commandResponse = await cliExecutor.executeCommand(commandToExecute, directory);
            if(commandResponse.success) {
                return "Initial command executed successfully, no errors found.";
            }

            return commandResponse.output;
        },
        returnDirect: false
    })
};
