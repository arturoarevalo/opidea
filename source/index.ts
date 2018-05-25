import * as program from 'commander';
import { actions } from './actions';

program
    .version('1.0.0')
    .description('The command line interface for the Opidea static blog generator');

actions.forEach(action => action.register(program));

if (!process.argv.slice(2).length) {
    program.outputHelp();
} else {
    program.parse(process.argv);
}
