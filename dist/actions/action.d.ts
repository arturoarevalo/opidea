import { CommanderStatic } from 'commander';
export declare abstract class Action {
    abstract register(program: CommanderStatic): void;
}
