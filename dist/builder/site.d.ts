import { Item } from '../helpers/item';
import { Frontmatter } from '../helpers/frontmatter';
import * as Moment from 'moment';
export interface Site {
    title: string;
    categories: Category[];
    tags: Tag[];
    entries: Entry[];
}
export interface Category {
    name: string;
    entries: Entry[];
}
export interface Tag {
    name: string;
    entries: Entry[];
}
export interface Entry {
    type: string;
    format: string;
    title: string;
    date: Moment.Moment;
    categories: Category[];
    tags: Tag[];
    excerpt: string;
    content: string;
    renderedContent: string;
}
export declare class SiteBuilder {
    getLoadEntryPoints(): Iterable<[string, Frontmatter]>;
    loadItems(): Item[];
    build(): Site;
    findCategory(site: Site, name: string): Category;
    findTag(site: Site, name: string): Category;
    findExcerpt(content: string): string;
}
