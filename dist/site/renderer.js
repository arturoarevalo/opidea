"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_utilities_1 = require("../helpers/file-utilities");
const fs_1 = require("fs");
class Renderer {
    static render(renderables) {
        console.log(renderables);
        Renderer.recreateFolder('./dist');
        for (const renderable of renderables) {
            file_utilities_1.FileUtilities.makeDirectoryRecursive('./dist/' + renderable.physicalFolder);
            fs_1.writeFileSync('./dist/' + renderable.physicalFile, renderable.render(renderable.context));
        }
    }
    static recreateFolder(folder) {
        file_utilities_1.FileUtilities.removeDirectoryRecursive(folder);
        file_utilities_1.FileUtilities.makeDirectoryRecursive(folder);
    }
}
exports.Renderer = Renderer;
