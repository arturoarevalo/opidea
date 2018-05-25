import { readFileSync } from 'fs';
import * as marked from 'marked';
import * as Moment from 'moment';
import { format } from 'util';
import { ListedFile } from '../helpers/file-utilities';
import { Frontmatter } from './frontmatter';

/**
 * In memory representation of a piece
 */
export class Piece {
    constructor(readonly path: string, readonly frontmatter: Frontmatter, readonly content: string) { }

    private static dateMatcher = /(\d{4})-(\d{2})-(\d{2})-/;

    static fromFile(file: ListedFile, parentFrontmatter = Frontmatter.empty): Piece {
        const parsed = Piece.parseFile(file.fullPath);
        const frontmatter = parentFrontmatter.clone();

        frontmatter.format = Piece.getFormatFromExtension(file.extension);

        if (this.dateMatcher.exec(file.name)) {
            frontmatter.set('date', Moment(file.name, 'YYYY-MM-DD-'));
            frontmatter.set('title', this.formatTitle(file.name.slice(11)));
        } else {
            frontmatter.set('title', this.formatTitle(file.name));
        }

        const html = (frontmatter.format === 'markdown') ? marked(parsed.content) : parsed.content;
        frontmatter.excerpt = frontmatter.excerpt || Piece.findExcerpt(html) || frontmatter.title;

        return new Piece(file.fullPath, frontmatter.extend(parsed.frontmatter), html);
    }

    private static parseFile(filename: string): { frontmatter: Frontmatter, content: string } {
        const content = readFileSync(filename, 'utf8');
        const lines = content.split('\n');

        if (lines.length > 1 && lines[0].startsWith('---')) {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].startsWith('---')) {
                    return {
                        frontmatter: Frontmatter.from(lines.slice(1, i)),
                        content: lines.slice(i + 1).join('\n')
                    };
                }
            }

            throw new Error(format('Malformed frontmatter in file "%s", missing ending "---"', filename));
        } else {
            return { frontmatter: Frontmatter.empty, content: content };
        }
    }

    private static formatTitle(title: string): string {
        return title.replace(/-/gi, ' ');
    }

    private static getFormatFromExtension(extension: string): string {
        if (extension === '.html') {
            return 'html';
        } else if (extension === '.md' || extension === '.markdown') {
            return 'markdown';
        } else {
            throw new Error(format('Unknown content type for extension "%s"', extension));
        }
    }

    private static findExcerpt(content: string): string {
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
