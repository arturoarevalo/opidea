"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stored_content_1 = require("./stored-content");
const fs_1 = require("fs");
const path = require("path");
const frontmatter_1 = require("./frontmatter");
const Moment = require("moment");
const file_loader_1 = require("./file-loader");
const util_1 = require("util");
class StoredContentLoader {
    static *load(folder, initialMatter = frontmatter_1.Frontmatter.empty) {
        for (const file of this.listFiles(folder)) {
            yield this.loadItem(file, initialMatter);
        }
        for (const name of this.listFolders(folder)) {
            const frontmatter = initialMatter.clone().extend(frontmatter_1.Frontmatter.from({ categories: [name] }));
            for (const item of this.load(folder + '/' + name, frontmatter)) {
                yield item;
            }
        }
    }
    static formatTitle(title) {
        return title.replace(/-/gi, ' ');
    }
    static loadItem(file, initialMatter = frontmatter_1.Frontmatter.empty) {
        const frontmatter = initialMatter.clone();
        frontmatter.set('format', this.getFormatFromExtension(file.extension));
        if (this.dateMatcher.exec(file.name)) {
            frontmatter.set('date', Moment(file.name, 'YYYY-MM-DD-'));
            frontmatter.set('title', this.formatTitle(file.name.slice(11)));
        }
        else {
            frontmatter.set('title', this.formatTitle(file.name));
        }
        const loadedFile = file_loader_1.FileLoader.loadFile(file.fullPath);
        frontmatter.extend(loadedFile.frontmatter);
        if (frontmatter.has('date') === false && frontmatter.role === 'entry') {
            throw new Error(util_1.format('Missing date in "%s", it should be present in the file name or its frontmatter metadata'));
        }
        return new stored_content_1.StoredContent(file.fullPath, frontmatter, loadedFile.content);
    }
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
    static getFormatFromExtension(extension) {
        return 'markdown';
    }
}
StoredContentLoader.dateMatcher = /(\d{4})-(\d{2})-(\d{2})-/;
exports.StoredContentLoader = StoredContentLoader;
