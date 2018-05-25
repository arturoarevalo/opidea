"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_utilities_1 = require("../helpers/file-utilities");
class Renderer {
    render(site, renderables) {
        this.recreateFolder('./dist');
        for (const renderable of renderables) {
            file_utilities_1.FileUtilities.makeDirectoryRecursive('./dist/' + renderable.physicalFolder);
            if (renderable.type === 'layout') {
            }
        }
    }
    recreateFolder(folder) {
        file_utilities_1.FileUtilities.removeDirectoryRecursive(folder);
        file_utilities_1.FileUtilities.makeDirectoryRecursive(folder);
    }
}
exports.Renderer = Renderer;
