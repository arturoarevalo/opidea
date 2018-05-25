import { CommanderStatic } from 'commander';

export abstract class Action {
    abstract register(program: CommanderStatic): void;
}
