import { Site, Renderable, Content, Style } from './interfaces';
import { Theme } from './theme';

interface PaginationResult {
    permalink: string;
    page: number;
    total_pages: number;
    pages: PaginationResult[];
    first: PaginationResult;
    previous: PaginationResult;
    next: PaginationResult;
    last: PaginationResult;
    entries: Content[];
    is_necessary: boolean;
    is_first: boolean;
    is_last: boolean;
}

export class Builder {
    static build(site: Site): Renderable[] {
        const renderables: Renderable[] = [];

        const flatten = <T = any>(list: any): T[] => list.reduce(
            (a: any, b: any) => a.concat(Array.isArray(b) ? flatten(b) : b), []
        );

        renderables.push(...site.entries.all.map((entry) => Builder.buildEntry(site, entry)));
        renderables.push(...flatten(site.pages.map((entry) => Builder.buildPage(site, entry))));
        renderables.push(...site.styles.map(Builder.buildStyle));

        return renderables;
    }

    private static buildStyle(style: Style): Renderable {
        return {
            type: 'style',
            physicalFolder: '/styles',
            physicalFile: '/styles/' + style.name + '.css',
            render: style.render,
            context: {}
        };
    }

    private static buildEntry(site: Site, content: Content): Renderable {
        const permalink = content.permalink;
        let folder = '';
        let filename = '';

        if (permalink.endsWith('.html')) {
            // permalink is a filename, get folder
            folder = permalink.replace('.html', '/');
            filename = permalink;
        } else {
            // permalink is a folder, get filename
            folder = permalink;
            filename = permalink + 'index.html';
        }

        return {
            type: 'content',
            render: (ctx: any): string => {
                const renderedContent = content.render(ctx);
                return site.layouts.get(content.frontmatter.layout).render({
                    entry: ctx.entry,
                    content: renderedContent
                });
            },
            physicalFolder: folder,
            physicalFile: filename,
            context: {
                entry: content
            }
        };
    }

    private static getCollection(site: Site, collection: string): Content[] {
        if (collection === 'featured') {
            return site.entries.featured;
        } else if (collection === 'regular') {
            return site.entries.regular;
        } else {
            return site.entries.all;
        }
    }

    private static paginate(site: Site, collectionName: string, basePermalink: string): PaginationResult[] {
        const perPage = 5;
        const collection = Builder.getCollection(site, collectionName);
        const results: PaginationResult[] = [];

        let page = 1;
        let i = 0;
        while (i < collection.length) {
            const permalink = (page === 1) ? basePermalink : (basePermalink + 'page/' + page.toString() + '/');

            const result: PaginationResult = {
                permalink: permalink,
                page: page,
                total_pages: 0,
                pages: results,
                first: undefined,
                previous: undefined,
                next: undefined,
                last: undefined,
                entries: [],
                is_necessary: false,
                is_first: false,
                is_last: false
            };

            for (let j = i; j < Math.min(collection.length, i + perPage); j++) {
                result.entries.push(collection[j]);
            }

            results.push(result);
            i += perPage;
            page++;
        }

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            result.total_pages = results.length;
            result.is_necessary = results.length > 1;
            result.is_first = i === 0;
            result.is_last = i === (results.length - 1);
            result.first = results[0];
            result.last = results[results.length - 1];

            if (i > 0) {
                result.previous = results[i - 1];
                results[i - 1].next = result;
            }
        }

        return results;
    }

    private static buildPage(site: Site, content: Content): Renderable[] {
        const results: Renderable[] = [];

        let basePermalink = content.permalink;
        if (content.frontmatter.role === 'site-index') {
            basePermalink = '/';
        }

        for (const page of Builder.paginate(site, content.frontmatter.get('pagination', 'all'), basePermalink)) {
            const permalink = page.permalink;
            let folder = '';
            let filename = '';

            if (permalink.endsWith('.html')) {
                // permalink is a filename, get folder
                folder = permalink.replace('.html', '/');
                filename = permalink;
            } else {
                // permalink is a folder, get filename
                folder = permalink;
                filename = permalink + 'index.html';
            }

            results.push({
                type: 'content',
                render: (ctx: any): string => {
                    const renderedContent = content.render(ctx);
                    return site.layouts.get(content.frontmatter.layout).render({
                        page: ctx.page,
                        content: renderedContent
                    });
                },
                physicalFolder: folder,
                physicalFile: filename,
                context: {
                    site: site,
                    page: content,
                    pagination: page
                }
            });

        }

        return results;

    }
}
