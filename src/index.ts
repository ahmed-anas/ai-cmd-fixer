#!/usr/bin/env node

import { AIFixerEngine } from "./lib/fixer-engine";


async function main() {
    let x = false;

    if(x){
        console.log('debugging');
        console.log(process.cwd());
        return;
    }

    const engine = new AIFixerEngine();

    await engine.processCommand();
}

main();
