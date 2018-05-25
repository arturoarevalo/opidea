import * as Moment from 'moment';
import { Frontmatter } from './frontmatter';
export interface CompiledTemplate<T = any> {
    (context: T, options?: any): string;
}
export interface Site {
    title: string;
    categories: Map<string, Category>;
    tags: Map<string, Tag>;
    entries: {
        all: Content[];
        featured: Content[];
        regular: Content[];
    };
    pages: Content[];
    blocks: Map<string, Block>;
    layouts: Map<string, Layout>;
    styles: Style[];
}
export interface Category {
    name: string;
    entries: Content[];
}
export interface Tag {
    name: string;
    entries: Content[];
}
export interface Layout {
    frontmatter: Frontmatter;
    template: string;
    render: CompiledTemplate;
}
export interface Block {
    frontmatter: Frontmatter;
    template: string;
    render: CompiledTemplate;
}
export interface Style {
    name: string;
    template: string;
    render: CompiledTemplate;
}
export interface Content {
    frontmatter: Frontmatter;
    template: string;
    render: CompiledTemplate;
    title: string;
    excerpt: string;
    categories: Category[];
    tags: Tag[];
    date: Moment.Moment;
    permalink: string;
}
export interface Renderable {
    type: string;
    render: CompiledTemplate;
    context: any;
    physicalFolder: string;
    physicalFile: string;
}
