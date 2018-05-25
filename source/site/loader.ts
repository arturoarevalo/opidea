import { FileUtilities } from '../helpers/file-utilities';
import { Frontmatter } from './frontmatter';
import { Piece } from './piece';
import { Theme } from './theme';
import { readFileSync } from 'fs';

export class Loader {

    static loadTheme(name: string): Theme {
        const baseFolder = `./themes/${name}`;
        const themeFile = `${baseFolder}/theme.json`;

        const theme = JSON.parse(readFileSync(themeFile, 'utf8').toString());

        theme.folders = theme.folder || {};
        theme.styles = theme.styles || {};

        const styles: { [name: string]: string } = {};
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

    static loadPieces(theme: Theme): Piece[] {
        const items: Piece[] = [];
        for (const [folder, frontmatter] of Loader.getLoadEntryPoints(theme)) {
            for (const item of Loader.loadPiecesInFolder(folder, frontmatter)) {
                items.push(item);
            }
        }
        return items;
    }

    private static * getLoadEntryPoints(theme: Theme): Iterable<[string, Frontmatter]> {
        yield [theme.blocksFolder, Frontmatter.from({ type: 'block' })];
        yield [theme.layoutsFolder, Frontmatter.from({ type: 'layout' })];
        yield [theme.pagesFolder, Frontmatter.from({ type: 'page', status: 'published', role: 'page', layout: 'page' })];

        yield ['./blocks', Frontmatter.from({ type: 'block' })];
        yield ['./layouts', Frontmatter.from({ type: 'layout' })];
        yield ['./entries', Frontmatter.from({ type: 'entry', status: 'published', role: 'entry', layout: 'entry' })];
        yield ['./pages', Frontmatter.from({ type: 'page', status: 'published', role: 'page', layout: 'page' })];
    }

    private static * loadPiecesInFolder(folder: string, initialMatter = Frontmatter.empty): Iterable<Piece> {
        for (const file of FileUtilities.listFiles(folder)) {
            yield Piece.fromFile(file, initialMatter);
        }

        for (const name of FileUtilities.listFolders(folder)) {
            const frontmatter = initialMatter.clone().extend(Frontmatter.from({ categories: [name] }));
            for (const item of Loader.loadPiecesInFolder(folder + '/' + name, frontmatter)) {
                yield item;
            }
        }
    }

}
