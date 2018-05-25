"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_1 = require("fs");
class FileUtilities {
    static *listFiles(folder) {
        for (const file of fs_1.readdirSync(folder)) {
            const fullPath = folder + '/' + file;
            const stats = fs_1.statSync(fullPath);
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
    static *listFolders(folder) {
        for (const file of fs_1.readdirSync(folder)) {
            const fullPath = folder + '/' + file;
            const stats = fs_1.statSync(fullPath);
            if (stats.isDirectory()) {
                yield file;
            }
        }
    }
    static removeDirectoryRecursive(folder) {
        if (fs_1.existsSync(folder)) {
            for (const entry of fs_1.readdirSync(folder)) {
                const entry_path = path.join(folder, entry);
                if (fs_1.lstatSync(entry_path).isDirectory()) {
                    FileUtilities.removeDirectoryRecursive(entry_path);
                }
                else {
                    fs_1.unlinkSync(entry_path);
                }
            }
            fs_1.rmdirSync(folder);
        }
    }
    static makeDirectoryRecursive(targetDir, { isRelativeToScript = false } = {}) {
        const sep = '/';
        const initDir = path.isAbsolute(targetDir) ? sep : '';
        const baseDir = isRelativeToScript ? __dirname : '.';
        targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(baseDir, parentDir, childDir);
            try {
                fs_1.mkdirSync(curDir);
            }
            catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
            }
            return curDir;
        }, initDir);
    }
}
exports.FileUtilities = FileUtilities;
