export interface ListedFile {
    fullPath: string;
    fullName: string;
    name: string;
    extension: string;
}
export declare class FileUtilities {
    static listFiles(folder: string): Iterable<ListedFile>;
    static listFolders(folder: string): Iterable<string>;
    static removeDirectoryRecursive(folder: string): void;
    static makeDirectoryRecursive(targetDir: string, {isRelativeToScript}?: {
        isRelativeToScript?: boolean;
    }): void;
}
