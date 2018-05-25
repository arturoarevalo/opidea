"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_utilities_1 = require("../helpers/file-utilities");
const frontmatter_1 = require("./frontmatter");
const piece_1 = require("./piece");
const fs_1 = require("fs");
class Loader {
    static loadTheme(name) {
        const baseFolder = `./themes/${name}`;
        const themeFile = `${baseFolder}/theme.json`;
        const theme = JSON.parse(fs_1.readFileSync(themeFile, 'utf8').toString());
        theme.folders = theme.folder || {};
        theme.styles = theme.styles || {};
        const styles = {};
        for (const key of Object.getOwnPropertyNames(theme.styles)) {
            styles[key] = theme.styles[key];
        }
        return {
            name: theme.name || name,
            baseFolder: baseFolder,
            blocksFolder: `${baseFolder}/${theme.folders.block || 'blocks'}`,
            layoutsFolder: `${baseFolder}/${theme.folders.layouts || 'layouts'}`,
            pagesFolder: `${baseFolder}/${theme.folders.pages || 'pages'}`,
            styles: styles
        };
    }
    static loadPieces(theme) {
        const items = [];
        for (const [folder, frontmatter] of Loader.getLoadEntryPoints(theme)) {
            for (const item of Loader.loadPiecesInFolder(folder, frontmatter)) {
                items.push(item);
            }
        }
        return items;
    }
    static *getLoadEntryPoints(theme) {
        yield [theme.blocksFolder, frontmatter_1.Frontmatter.from({ type: 'block' })];
        yield [theme.layoutsFolder, frontmatter_1.Frontmatter.from({ type: 'layout' })];
        yield [theme.pagesFolder, frontmatter_1.Frontmatter.from({ type: 'page', status: 'published', role: 'page', layout: 'page' })];
        yield ['./blocks', frontmatter_1.Frontmatter.from({ type: 'block' })];
        yield ['./layouts', frontmatter_1.Frontmatter.from({ type: 'layout' })];
        yield ['./entries', frontmatter_1.Frontmatter.from({ type: 'entry', status: 'published', role: 'entry', layout: 'entry' })];
        yield ['./pages', frontmatter_1.Frontmatter.from({ type: 'page', status: 'published', role: 'page', layout: 'page' })];
    }
    static *loadPiecesInFolder(folder, initialMatter = frontmatter_1.Frontmatter.empty) {
        for (const file of file_utilities_1.FileUtilities.listFiles(folder)) {
            yield piece_1.Piece.fromFile(file, initialMatter);
        }
        for (const name of file_utilities_1.FileUtilities.listFolders(folder)) {
            const frontmatter = initialMatter.clone().extend(frontmatter_1.Frontmatter.from({ categories: [name] }));
            for (const item of Loader.loadPiecesInFolder(folder + '/' + name, frontmatter)) {
                yield item;
            }
        }
    }
}
exports.Loader = Loader;
