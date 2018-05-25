import { CommanderStatic } from 'commander';
import { Action } from './action';
export declare class ServeAction extends Action {
    register(program: CommanderStatic): void;
    execute(port: number): Promise<void>;
}
