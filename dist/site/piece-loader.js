"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_utilities_1 = require("./file-utilities");
const frontmatter_1 = require("./frontmatter");
const piece_1 = require("./piece");
class PieceLoader {
    static *load(folder, initialMatter = frontmatter_1.Frontmatter.empty) {
        for (const file of file_utilities_1.FileUtilities.listFiles(folder)) {
            yield piece_1.Piece.fromFile(file, initialMatter);
        }
        for (const name of file_utilities_1.FileUtilities.listFolders(folder)) {
            const frontmatter = initialMatter.clone().extend(frontmatter_1.Frontmatter.from({ categories: [name] }));
            for (const item of this.load(folder + '/' + name, frontmatter)) {
                yield item;
            }
        }
    }
}
exports.PieceLoader = PieceLoader;
