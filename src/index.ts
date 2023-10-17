#!/usr/bin/env node

import { AIFixerEngine } from "./lib/fixer-engine";


async function main() {
    const engine = new AIFixerEngine();

    await engine.processCommand();
}

main();
