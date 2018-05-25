"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frontmatter_1 = require("./frontmatter");
const fs_1 = require("fs");
const util_1 = require("util");
class FileLoader {
    static loadFile(filename) {
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
            return {
                frontmatter: frontmatter_1.Frontmatter.empty,
                content: content
            };
        }
    }
}
exports.FileLoader = FileLoader;
