import { Frontmatter } from './frontmatter';
export declare class StoredContent {
    readonly path: string;
    readonly frontmatter: Frontmatter;
    readonly content: string;
    constructor(path: string, frontmatter: Frontmatter, content: string);
}
