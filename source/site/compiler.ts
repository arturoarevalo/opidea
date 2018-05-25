import { Piece } from './piece';
import { Frontmatter } from './frontmatter';
import * as Handlebars from 'handlebars';
import { Site, Content, Category, Tag, Block, Layout, Style } from './interfaces';
import * as Moment from 'moment';
import { format } from 'util';
import { Theme } from './theme';
import { readFileSync } from 'fs';
import * as Sass from 'node-sass';

export class Compiler {

    static compile(theme: Theme, pieces: Piece[]): Site {
        const categories = new Map<string, Category>();
        const tags = new Map<string, Tag>();
        const allEntries: Content[] = [];
        const featuredEntries: Content[] = [];
        const regularEntries: Content[] = [];
        const pages: Content[] = [];
        const blocks = new Map<string, Block>();
        const layouts = new Map<string, Layout>();

        // parse blocks
        for (const piece of pieces.filter(p => p.frontmatter.type === 'block')) {
            blocks.set(piece.frontmatter.title, Compiler.compileBlockPiece(piece));
        }

        // parse layouts
        for (const piece of pieces.filter(p => p.frontmatter.type === 'layout')) {
            layouts.set(piece.frontmatter.title, Compiler.compileLayout(piece, blocks));
        }

        // parse entries
        for (const piece of pieces.filter(p => p.frontmatter.type === 'entry')) {
            const content = Compiler.compileEntry(piece, blocks);

            for (const name of piece.frontmatter.categories) {
                const category = categories.get(name);
                if (category === undefined) {
                    categories.set(name, {
                        name: name,
                        entries: [content]
                    });
                } else {
                    category.entries.push(content);
                }

                content.categories.push(category);
            }

            for (const name of piece.frontmatter.tags) {
                const tag = tags.get(name);
                if (tag === undefined) {
                    tags.set(name, {
                        name: name,
                        entries: [content]
                    });
                } else {
                    tag.entries.push(content);
                }

                content.tags.push(tag);
            }

            allEntries.push(content);
            if (content.frontmatter.get('featured')) {
                featuredEntries.push(content);
            } else {
                regularEntries.push(content);
            }
        }

        // parse pages
        for (const piece of pieces.filter(p => p.frontmatter.type === 'page')) {
            pages.push(Compiler.compilePage(piece, blocks));
        }

        return {
            title: '',
            categories: categories,
            tags: tags,
            entries: {
                all: allEntries,
                featured: featuredEntries,
                regular: regularEntries
            },
            pages: pages,
            blocks: blocks,
            layouts: layouts,
            styles: Compiler.compileStyles(theme)
        };
    }

    static compileStyles(theme: Theme): Style[] {
        const styles: Style[] = [];

        for (const key of Object.getOwnPropertyNames(theme.styles)) {
            const styleFilename = theme.styles[key];
            const filename = theme.baseFolder + '/' + styleFilename;
            const content = readFileSync(filename, 'utf8');

            styles.push({
                name: key,
                template: content,
                render: () => Sass.renderSync({
                    file: filename,
                    outputStyle: 'compressed'
                }).css.toString()
            });
        }

        return styles;
    }

    static compileBlockPiece(piece: Piece): Block {
        return {
            frontmatter: piece.frontmatter,
            template: piece.content,
            render: Handlebars.compile(piece.content)
        };
    }

    static compileLayout(piece: Piece, blocks: Map<string, Block>): Layout {
        const content = Compiler.includeBlocks(piece.content, blocks);

        return {
            frontmatter: piece.frontmatter,
            template: content,
            render: Handlebars.compile(content)
        };
    }

    static compileEntry(piece: Piece, blocks: Map<string, Block>): Content {
        const c = Compiler.includeBlocks(piece.content, blocks);

        return {
            frontmatter: piece.frontmatter,
            template: piece.content,
            render: Handlebars.compile(c),
            title: piece.frontmatter.title,
            excerpt: piece.frontmatter.excerpt,
            categories: [],
            tags: [],
            date: piece.frontmatter.date,
            permalink: Compiler.buildPermalink(piece.frontmatter, piece.frontmatter.permalink || 'pretty')
        };
    }

    static compilePage(piece: Piece, blocks: Map<string, Block>): Content {
        const c = Compiler.includeBlocks(piece.content, blocks);

        return {
            frontmatter: piece.frontmatter,
            template: piece.content,
            render: Handlebars.compile(c),
            title: piece.frontmatter.title,
            excerpt: piece.frontmatter.excerpt,
            categories: [],
            tags: [],
            date: piece.frontmatter.date,
            permalink: Compiler.buildPermalink(piece.frontmatter, piece.frontmatter.permalink || 'pretty')
        };
    }

    static compileRawLayoutPieces(layoutPieces: Map<string, Piece>, blocks: Map<string, Block>): Map<string, Layout> {
        const layouts = new Map<string, Layout>();
        for (const [name, piece] of layoutPieces) {
            const content = Compiler.includeBlocks(piece.content, blocks);

            layouts.set(name, {
                frontmatter: piece.frontmatter,
                template: content,
                render: Handlebars.compile(content)
            });
        }

        return layouts;
    }

    static includeBlocks(content: string, blocks: Map<string, Block>): string {
        // resolve block includes
        for (const [blockName, block] of blocks) {
            const includeKey = `{{include ${blockName}}}`;
            content = content.split(includeKey).join(block.template);
        }

        return content;
    }

    static buildPermalink(frontmatter: Frontmatter, format = 'pretty'): string {
        const date = frontmatter.date ? frontmatter.date : Moment();
        const variables = new Map<string, string>([
            [':categories', frontmatter.categories.join('/')],
            [':year', date.format('YYYY')],
            [':month', date.format('MM')],
            [':day', date.format('DD')],
            [':title', Compiler.slugify(frontmatter.title)],
            [':extension', '.html']
        ]);

        if (format === 'date') {
            format = '/:categories/:year/:month/:day/:title:extension';
        } else if (format === 'pretty' || format === '') {
            format = '/:categories/:year/:month/:day/:title/';
        } else if (format === 'ordinal') {
            format = '/:categories/:year/:y_day/:title:extension';
        } else if (format === 'none') {
            format = '/:categories/:title:extension';
        }

        for (const [key, value] of variables) {
            format = format.replace(key, value);
        }

        // remove possible duplicate slahes due to lack of categories
        return format.replace(/\/\/+/g, '/');
    }

    static slugify(text: string): string {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }
}
