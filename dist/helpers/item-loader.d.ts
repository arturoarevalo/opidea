import { StoredContent } from './stored-content';
import { Frontmatter } from './frontmatter';
export declare class StoredContentLoader {
    static dateMatcher: RegExp;
    static load(folder: string, initialMatter?: Frontmatter): Iterable<StoredContent>;
    private static formatTitle(title);
    private static loadItem(file, initialMatter?);
    private static listFiles(folder);
    private static listFolders(folder);
    private static getFormatFromExtension(extension);
}
