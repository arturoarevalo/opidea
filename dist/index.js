"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const actions_1 = require("./actions");
program
    .version('1.0.0')
    .description('The command line interface for the Opidea static blog generator');
actions_1.actions.forEach(action => action.register(program));
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
else {
    program.parse(process.argv);
}
