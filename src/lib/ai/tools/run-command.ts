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
            console.log(' - re-running command');
            let commandResponse = await cliExecutor.executeCommand(commandToExecute, directory);
            if(commandResponse.success) {
                return "Everything is fixed. Execute end summary to end this process.";
            }

            console.log(' - command output');
            console.log('------------------');
            console.log(commandResponse.output);
            console.log('------------------');

            return commandResponse.output;
        },
        returnDirect: false
    })
};
