import { CommanderStatic } from 'commander';
import { existsSync, mkdirSync } from 'fs';
import { TemplateRenderer } from '../helpers/template-renderer';
import { Action } from './action';

export class InitAction extends Action {
    register(program: CommanderStatic): void {
        program
            .command('init <name> [title]')
            .description('Creates a new static site project in the specified folder')
            .action(async (name: string, title?: string) => {
                await this.execute(name, title);
            });
    }

    async execute(name: string, title?: string): Promise<void> {
        const templateRenderer = new TemplateRenderer();
        const root = './' + name;
        const context = {
            title: title || 'Just another blog'
        };

        if (existsSync(root)) {
            console.log('A folder or file named "%s" already exists', root);
        } else {
            mkdirSync(root);

            const folders = ['assets', 'entries', 'pages', 'dist', 'themes'];
            for (const folder of folders) {
                mkdirSync(root + '/' + folder);
            }

            const files = [
                // site definition file
                'opidea.json'
            ];

            for (const file of files) {
                templateRenderer.render(file, context, root + '/' + file);
            }
        }

    }
}
