import * as readline from 'readline';

export class UserInteraction {
    private rl: readline.Interface;


    static get() {
        return new UserInteraction();
    }

    private constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public getInput(input: string): Promise<string>  {
        return new Promise((resolve) => {
            this.rl.question(input, (command) => {
                resolve(command);
            });
        });
    }

    /**
     * Prompt the user for a command to run and fix.
     * @returns A promise that resolves to the user's input.
     */
    public getCommandInput(): Promise<string> {
        return this.getInput('Please enter the command you want to run and fix: ');
    }

    /**
     * Prompt the user for a command to run and fix.
     * @returns A promise that resolves to the user's input.
     */
    public async getDirectory(): Promise<string> {
        const defaultDir = process.cwd();
        return (await this.getInput('Please enter directory where the command should be executed. Leave empty to use current dir: ')) || defaultDir;
    }

    /**
     * Close the readline interface.
     */
    public close(): void {
        this.rl.close();
    }
}
