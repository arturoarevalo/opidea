"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frontmatter_1 = require("./frontmatter");
const fs_1 = require("fs");
const util_1 = require("util");
const marked = require("marked");
const Moment = require("moment");
class Piece {
    constructor(path, frontmatter, content) {
        this.path = path;
        this.frontmatter = frontmatter;
        this.content = content;
    }
    static fromFile(file, parentFrontmatter = frontmatter_1.Frontmatter.empty) {
        const parsed = Piece.parseFile(file.fullPath);
        const frontmatter = parentFrontmatter.clone();
        frontmatter.format = Piece.getFormatFromExtension(file.extension);
        if (this.dateMatcher.exec(file.name)) {
            frontmatter.set('date', Moment(file.name, 'YYYY-MM-DD-'));
            frontmatter.set('title', this.formatTitle(file.name.slice(11)));
        }
        else {
            frontmatter.set('title', this.formatTitle(file.name));
        }
        const html = (frontmatter.format === 'markdown') ? marked(parsed.content) : parsed.content;
        frontmatter.excerpt = frontmatter.excerpt || Piece.findExcerpt(html) || frontmatter.title;
        return new Piece(file.fullPath, frontmatter.extend(parsed.frontmatter), html);
    }
    static parseFile(filename) {
        const content = fs_1.readFileSync(filename, 'utf8');
        const lines = content.split('\n');
        if (lines.length > 1 && lines[0].startsWith('---')) {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].startsWith('---')) {
                    return {
                        frontmatter: frontmatter_1.Frontmatter.from(lines.slice(1, i)),
                        content: lines.slice(i + 1).join('\n')
                    };
                }
            }
            throw new Error(util_1.format('Malformed frontmatter in file "%s", missing ending "---"', filename));
        }
        else {
            return { frontmatter: frontmatter_1.Frontmatter.empty, content: content };
        }
    }
    static formatTitle(title) {
        return title.replace(/-/gi, ' ');
    }
    static getFormatFromExtension(extension) {
        if (extension === '.html') {
            return 'html';
        }
        else if (extension === '.md' || extension === '.markdown') {
            return 'markdown';
        }
        else {
            throw new Error(util_1.format('Unknown content type for extension "%s"', extension));
        }
    }
    static findExcerpt(content) {
        const lowerContent = content.toLocaleLowerCase();
        const i = lowerContent.indexOf('<p>');
        if (i >= 0) {
            const j = lowerContent.indexOf('</p>', i + 3);
            if (j >= 0) {
                return content.substring(i + 3, j);
            }
        }
        return undefined;
    }
}
Piece.dateMatcher = /(\d{4})-(\d{2})-(\d{2})-/;
exports.Piece = Piece;
