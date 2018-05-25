import { CommanderStatic } from 'commander';
import { Action } from './action';
export declare class BuildAction extends Action {
    register(program: CommanderStatic): void;
    execute(): Promise<void>;
}
