"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Builder {
    static build(site) {
        const renderables = [];
        const flatten = (list) => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
        renderables.push(...site.entries.all.map((entry) => Builder.buildEntry(site, entry)));
        renderables.push(...flatten(site.pages.map((entry) => Builder.buildPage(site, entry))));
        renderables.push(...site.styles.map(Builder.buildStyle));
        return renderables;
    }
    static buildStyle(style) {
        return {
            type: 'style',
            physicalFolder: '/styles',
            physicalFile: '/styles/' + style.name + '.css',
            render: style.render,
            context: {}
        };
    }
    static buildEntry(site, content) {
        const permalink = content.permalink;
        let folder = '';
        let filename = '';
        if (permalink.endsWith('.html')) {
            folder = permalink.replace('.html', '/');
            filename = permalink;
        }
        else {
            folder = permalink;
            filename = permalink + 'index.html';
        }
        return {
            type: 'content',
            render: (ctx) => {
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
    static getCollection(site, collection) {
        if (collection === 'featured') {
            return site.entries.featured;
        }
        else if (collection === 'regular') {
            return site.entries.regular;
        }
        else {
            return site.entries.all;
        }
    }
    static paginate(site, collectionName, basePermalink) {
        const perPage = 5;
        const collection = Builder.getCollection(site, collectionName);
        const results = [];
        let page = 1;
        let i = 0;
        while (i < collection.length) {
            const permalink = (page === 1) ? basePermalink : (basePermalink + 'page/' + page.toString() + '/');
            const result = {
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
    static buildPage(site, content) {
        const results = [];
        let basePermalink = content.permalink;
        if (content.frontmatter.role === 'site-index') {
            basePermalink = '/';
        }
        for (const page of Builder.paginate(site, content.frontmatter.get('pagination', 'all'), basePermalink)) {
            const permalink = page.permalink;
            let folder = '';
            let filename = '';
            if (permalink.endsWith('.html')) {
                folder = permalink.replace('.html', '/');
                filename = permalink;
            }
            else {
                folder = permalink;
                filename = permalink + 'index.html';
            }
            results.push({
                type: 'content',
                render: (ctx) => {
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
exports.Builder = Builder;
