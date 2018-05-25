import { CommanderStatic } from 'commander';
import { Action } from './action';
import { Compiler } from '../site/compiler';
import { Loader } from '../site/loader';
import { Builder } from '../site/builder';
import { Renderer } from '../site/renderer';

export class BuildAction extends Action {
    register(program: CommanderStatic): void {
        program
            .command('build')
            .description('Builds the project')
            .action(async () => {
                await this.execute();
            });
    }

    async execute(): Promise<void> {
        const theme = Loader.loadTheme('default');
        const pieces = Loader.loadPieces(theme);
        const site = Compiler.compile(theme, pieces);
        const renderables = Builder.build(site);

        Renderer.render(renderables);
    }
}
