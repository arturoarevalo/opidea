"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StoredContent {
    constructor(path, frontmatter, content) {
        this.path = path;
        this.frontmatter = frontmatter;
        this.content = content;
    }
}
exports.StoredContent = StoredContent;
