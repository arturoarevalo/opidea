"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const item_loader_1 = require("../helpers/item-loader");
const frontmatter_1 = require("../helpers/frontmatter");
const marked = require("marked");
const Handlebars = require("handlebars");
class SiteBuilder {
    *getLoadEntryPoints() {
        yield ['./posts', frontmatter_1.Frontmatter.from({ status: 'published', type: 'post' })];
        yield ['./drafts', frontmatter_1.Frontmatter.from({ status: 'draft', type: 'post' })];
        yield ['./pages', frontmatter_1.Frontmatter.from({ status: 'published', type: 'page' })];
    }
    loadItems() {
        const items = [];
        for (const [folder, frontmatter] of this.getLoadEntryPoints()) {
            for (const item of item_loader_1.ItemLoader.load(folder, frontmatter)) {
                items.push(item);
            }
        }
        return items;
    }
    build() {
        const site = {
            title: '',
            categories: [],
            tags: [],
            entries: []
        };
        for (const item of this.loadItems()) {
            const compiler = Handlebars.compile(item.content);
            const content = compiler({});
            const html = marked(content);
            const entry = {
                type: item.frontmatter.type,
                format: item.frontmatter.format,
                title: item.frontmatter.title,
                date: item.frontmatter.date,
                categories: [],
                tags: [],
                content: content,
                renderedContent: html,
                excerpt: item.frontmatter.excerpt || this.findExcerpt(html) || item.frontmatter.title
            };
            for (const name of item.frontmatter.categories) {
                const category = this.findCategory(site, name);
                entry.categories.push(category);
                category.entries.push(entry);
            }
            for (const name of item.frontmatter.tags) {
                const tag = this.findTag(site, name);
                entry.tags.push(tag);
                tag.entries.push(entry);
            }
            site.entries.push(entry);
        }
        return site;
    }
    findCategory(site, name) {
        for (const category of site.categories) {
            if (category.name === name) {
                return category;
            }
        }
        const category = {
            name: name,
            entries: []
        };
        site.categories.push(category);
        return category;
    }
    findTag(site, name) {
        for (const tag of site.tags) {
            if (tag.name === name) {
                return tag;
            }
        }
        const tag = {
            name: name,
            entries: []
        };
        site.tags.push(tag);
        return tag;
    }
    findExcerpt(content) {
        const lowerContent = content.toLocaleLowerCase();
        const i = lowerContent.indexOf('<p>');
        if (i >= 0) {
            const j = lowerContent.indexOf('</p>', i + 3);
            if (j >= 0) {
                return content.substring(i + 3, j);
            }
        }
        return undefined;
    }
}
exports.SiteBuilder = SiteBuilder;
