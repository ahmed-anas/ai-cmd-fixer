// Import the CLIExecutor class once you've created it
// import { CLIExecutor } from './CLIExecutor';
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import * as readline from 'readline';

import { ReadLinesTool } from "./ai/tools/read-lines";
import { UpdateLinesTool } from "./ai/tools/update-lines";
import { CLIExecutor } from "./cli-executor";
import { UserInteraction } from "./user-interaction";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanInterventionTool } from "./ai/tools/human-intervention";
import { RunCommandTool } from "./ai/tools/run-command";
import { config } from "../config";

export class AIFixerEngine {
    private userInteraction: UserInteraction;
    private cliExecutor: CLIExecutor;

    // private executor: AgentExecutor | undefined;

    constructor() {
        this.userInteraction = UserInteraction.get();
        this.cliExecutor = new CLIExecutor();
    }


    async getExecutor(command: string, directory: string) {
        const tools = [
            ReadLinesTool(),
            UpdateLinesTool(),
            HumanInterventionTool(),
            RunCommandTool(command, directory)
        ];

        const openApiKey = process.env.OPEN_API_KEY;

        if (!openApiKey) {
            throw new Error('open api key not defined in OPEN_API_KEY env variable')
        }

        const model = new ChatOpenAI({
            modelName: 'gpt-3.5-turbo',
            temperature: 0,
            openAIApiKey: openApiKey,
            verbose: config.verbose,
        });

        return await initializeAgentExecutorWithOptions(tools, model, {
            agentType: "openai-functions",
            verbose: config.verbose,
            agentArgs: {
            },
        });
    }


    /**
     * Main method to orchestrate the process of getting user input, executing the command, 
     * and passing the output to the AI for fixing.
     */
    public async processCommand(): Promise<void> {
        try {

            // const directory = await this.userInteraction.getDirectory();
            // const command = await this.userInteraction.getCommandInput();

            const command = 'npm run lint';
            const directory = `G:/work/personal-code/ai-cmd-fixer/test-project`
            const exector = await this.getExecutor(command, directory);

            const response = await exector.run(`the output for my "npm run lint" command is the following. I want you fix it using the functions you have available.


            G:/work/personal-code/ai-cmd-fixer/test-project/src/main.ts
            3:85  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
            4:3   error  Unnecessary try/catch wrapper             no-useless-catch
           10:60  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
           16:55  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
           22:62  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
         
         ✖ 5 problems (5 errors, 0 warnings)
            
            `);



            console.log('ai output', response);



            // if (x) {
            //     // 1. Get command input from the user
            //     const command = await this.userInteraction.getCommandInput();

            //     // 2. Execute the command and get the output
            //     const output = await this.cliExecutor.executeCommand(command);

            //     // 3. Pass the output to the AI for fixing
            //     // const fixedCommand = await this.passToAIForFixing(output);

            //     // 4. Optionally, you can loop through steps 2 and 3 until the command executes successfully.
            // }
        } catch (err) {
            console.error('error in plugin: ' + err)
        }

        finally {
            this.userInteraction.close();
        }
    }
}
