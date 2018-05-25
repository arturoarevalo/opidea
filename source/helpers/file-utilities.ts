import * as path from 'path';
import { existsSync, readdirSync, lstatSync, unlinkSync, rmdirSync, mkdirSync, statSync } from 'fs';

export interface ListedFile {
    fullPath: string;
    fullName: string;
    name: string;
    extension: string;
}

export class FileUtilities {

    static *listFiles(folder: string): Iterable<ListedFile> {
        for (const file of readdirSync(folder)) {
            const fullPath = folder + '/' + file;
            const stats = statSync(fullPath);

            if (stats.isFile()) {
                yield {
                    fullPath: fullPath,
                    fullName: file,
                    name: path.basename(file, path.extname(file)),
                    extension: path.extname(file)
                };
            }
        }
    }

    static *listFolders(folder: string): Iterable<string> {
        for (const file of readdirSync(folder)) {
            const fullPath = folder + '/' + file;
            const stats = statSync(fullPath);

            if (stats.isDirectory()) {
                yield file;
            }
        }
    }

    static removeDirectoryRecursive(folder: string): void {
        if (existsSync(folder)) {
            for (const entry of readdirSync(folder)) {
                const entry_path = path.join(folder, entry);
                if (lstatSync(entry_path).isDirectory()) {
                    FileUtilities.removeDirectoryRecursive(entry_path);
                } else {
                    unlinkSync(entry_path);
                }
            }
            rmdirSync(folder);
        }
    }

    static makeDirectoryRecursive(targetDir: string, { isRelativeToScript = false } = {}): void {
        const sep = '/'; // path.sep;
        const initDir = path.isAbsolute(targetDir) ? sep : '';
        const baseDir = isRelativeToScript ? __dirname : '.';

        targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(baseDir, parentDir, childDir);
            try {
                mkdirSync(curDir);
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
            }

            return curDir;
        }, initDir);
    }

}
