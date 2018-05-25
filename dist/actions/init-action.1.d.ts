import { CommanderStatic } from 'commander';
import { Action } from './action';
export declare class InitAction extends Action {
    register(program: CommanderStatic): void;
    execute(name: string, title?: string): Promise<void>;
}
