import * as Moment from 'moment';
export declare class Frontmatter {
    private readonly metadata;
    static from(lines: string[]): Frontmatter;
    static from(metadata: Map<string, any>): Frontmatter;
    static from(anything: any): Frontmatter;
    static readonly empty: Frontmatter;
    protected constructor(metadata?: Map<string, any>);
    clone(): Frontmatter;
    get<T = any>(key: string, defaultValue?: T): T;
    set<T = any>(key: string, value: T): this;
    has(key: string): boolean;
    type: string;
    format: string;
    title: string;
    layout: string;
    role: string;
    permalink: string;
    excerpt: string;
    date: Moment.Moment;
    categories: string[];
    tags: string[];
    extend(frontmatter: Frontmatter): this;
    dump(): string;
}
