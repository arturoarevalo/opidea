"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Handlebars = require("handlebars");
const Moment = require("moment");
const fs_1 = require("fs");
const Sass = require("node-sass");
class Compiler {
    static compile(theme, pieces) {
        const categories = new Map();
        const tags = new Map();
        const allEntries = [];
        const featuredEntries = [];
        const regularEntries = [];
        const pages = [];
        const blocks = new Map();
        const layouts = new Map();
        for (const piece of pieces.filter(p => p.frontmatter.type === 'block')) {
            blocks.set(piece.frontmatter.title, Compiler.compileBlockPiece(piece));
        }
        for (const piece of pieces.filter(p => p.frontmatter.type === 'layout')) {
            layouts.set(piece.frontmatter.title, Compiler.compileLayout(piece, blocks));
        }
        for (const piece of pieces.filter(p => p.frontmatter.type === 'entry')) {
            const content = Compiler.compileEntry(piece, blocks);
            for (const name of piece.frontmatter.categories) {
                const category = categories.get(name);
                if (category === undefined) {
                    categories.set(name, {
                        name: name,
                        entries: [content]
                    });
                }
                else {
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
                }
                else {
                    tag.entries.push(content);
                }
                content.tags.push(tag);
            }
            allEntries.push(content);
            if (content.frontmatter.get('featured')) {
                featuredEntries.push(content);
            }
            else {
                regularEntries.push(content);
            }
        }
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
    static compileStyles(theme) {
        const styles = [];
        for (const key of Object.getOwnPropertyNames(theme.styles)) {
            const styleFilename = theme.styles[key];
            const filename = theme.baseFolder + '/' + styleFilename;
            const content = fs_1.readFileSync(filename, 'utf8');
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
    static compileBlockPiece(piece) {
        return {
            frontmatter: piece.frontmatter,
            template: piece.content,
            render: Handlebars.compile(piece.content)
        };
    }
    static compileLayout(piece, blocks) {
        const content = Compiler.includeBlocks(piece.content, blocks);
        return {
            frontmatter: piece.frontmatter,
            template: content,
            render: Handlebars.compile(content)
        };
    }
    static compileEntry(piece, blocks) {
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
    static compilePage(piece, blocks) {
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
    static compileRawLayoutPieces(layoutPieces, blocks) {
        const layouts = new Map();
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
    static includeBlocks(content, blocks) {
        for (const [blockName, block] of blocks) {
            const includeKey = `{{include ${blockName}}}`;
            content = content.split(includeKey).join(block.template);
        }
        return content;
    }
    static buildPermalink(frontmatter, format = 'pretty') {
        const date = frontmatter.date ? frontmatter.date : Moment();
        const variables = new Map([
            [':categories', frontmatter.categories.join('/')],
            [':year', date.format('YYYY')],
            [':month', date.format('MM')],
            [':day', date.format('DD')],
            [':title', Compiler.slugify(frontmatter.title)],
            [':extension', '.html']
        ]);
        if (format === 'date') {
            format = '/:categories/:year/:month/:day/:title:extension';
        }
        else if (format === 'pretty' || format === '') {
            format = '/:categories/:year/:month/:day/:title/';
        }
        else if (format === 'ordinal') {
            format = '/:categories/:year/:y_day/:title:extension';
        }
        else if (format === 'none') {
            format = '/:categories/:title:extension';
        }
        for (const [key, value] of variables) {
            format = format.replace(key, value);
        }
        return format.replace(/\/\/+/g, '/');
    }
    static slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
}
exports.Compiler = Compiler;
