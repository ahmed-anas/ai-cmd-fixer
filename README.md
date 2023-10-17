# ai-cmd-fixer

## 🚧 Under Development 🚧

**Disclaimer: This tool is under active development. Backup your code before running it.**
**NO GURANTEES! USE AT YOUR OWN RISK!!!**

An AI-powered tool that seamlessly integrates with your terminal to intelligently diagnose and optimize command issues. The tool will modify the necessary files and rerun the command until it succeeds.

## Installation

To install globally, run:

```bash
npm install -g ai-cmd-fixer
```

## Requirements

- OPEN_API_KEY environment variable set with your OpenAI API key.

## Usage

After installation, run:

```bash
ai-cmd-fixer
```

It will prompt you to enter the directory where the command should be executed and the command itself. It will then proceed to automatically fix the command and rerun it.

## Sample Run

Before running `ai-cmd-fixer`, `npm run lint` produced the following errors:

```bash
src/main.ts
   3:85  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   4:3   error  Unnecessary try/catch wrapper             no-useless-catch
  ...
```

After running `ai-cmd-fixer` and answering its prompts:

```bash
Please enter directory where the command should be executed. Leave empty to use current dir:
Please enter the command you want to run and fix: npm run lint
```

The tool automatically corrected the files:

```bash
 - Updating src/main.ts:3-3
-------------
...
```

And the subsequent `npm run lint` run was successful.

## Contributing

For bugs and feature requests, please create an issue on [GitHub](https://github.com/ahmed-anas/ai-cmd-fixer/issues).

## License

MIT
