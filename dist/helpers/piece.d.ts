import { ListedFile } from './file-utilities';
import { Frontmatter } from './frontmatter';
export declare class Piece {
    readonly path: string;
    readonly frontmatter: Frontmatter;
    readonly content: string;
    constructor(path: string, frontmatter: Frontmatter, content: string);
    private static dateMatcher;
    static fromFile(file: ListedFile, parentFrontmatter?: any): Piece;
    private static parseFile(filename);
    private static formatTitle(title);
    private static getFormatFromExtension(extension);
    private static findExcerpt(content);
}
