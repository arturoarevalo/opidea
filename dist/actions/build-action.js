"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_1 = require("./action");
const compiler_1 = require("../site/compiler");
const loader_1 = require("../site/loader");
const builder_1 = require("../site/builder");
const renderer_1 = require("../site/renderer");
class BuildAction extends action_1.Action {
    register(program) {
        program
            .command('build')
            .description('Builds the project')
            .action(async () => {
            await this.execute();
        });
    }
    async execute() {
        const theme = loader_1.Loader.loadTheme('default');
        const pieces = loader_1.Loader.loadPieces(theme);
        const site = compiler_1.Compiler.compile(theme, pieces);
        const renderables = builder_1.Builder.build(site);
        renderer_1.Renderer.render(renderables);
    }
}
exports.BuildAction = BuildAction;
