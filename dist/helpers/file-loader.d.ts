import { Frontmatter } from './frontmatter';
export declare class FileLoader {
    static loadFile(filename: string): {
        frontmatter: Frontmatter;
        content: string;
    };
}
