"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const template_renderer_1 = require("../helpers/template-renderer");
const action_1 = require("./action");
class InitAction extends action_1.Action {
    register(program) {
        program
            .command('init <name> [title]')
            .description('Creates a new static site project in the specified folder')
            .action(async (name, title) => {
            await this.execute(name, title);
        });
    }
    async execute(name, title) {
        const templateRenderer = new template_renderer_1.TemplateRenderer();
        const root = './' + name;
        const context = {
            title: title || 'Just another blog'
        };
        if (fs_1.existsSync(root)) {
            console.log('A folder or file named "%s" already exists', root);
        }
        else {
            fs_1.mkdirSync(root);
            const folders = ['assets', 'entries', 'pages', 'dist', 'themes'];
            for (const folder of folders) {
                fs_1.mkdirSync(root + '/' + folder);
            }
            const files = [
                'opidea.json'
            ];
            for (const file of files) {
                templateRenderer.render(file, context, root + '/' + file);
            }
        }
    }
}
exports.InitAction = InitAction;
