import { Piece } from './piece';
import { Frontmatter } from './frontmatter';
import { Site, Content, Block, Layout, Style } from './interfaces';
import { Theme } from './theme';
export declare class Compiler {
    static compile(theme: Theme, pieces: Piece[]): Site;
    static compileStyles(theme: Theme): Style[];
    static compileBlockPiece(piece: Piece): Block;
    static compileLayout(piece: Piece, blocks: Map<string, Block>): Layout;
    static compileEntry(piece: Piece, blocks: Map<string, Block>): Content;
    static compilePage(piece: Piece, blocks: Map<string, Block>): Content;
    static compileRawLayoutPieces(layoutPieces: Map<string, Piece>, blocks: Map<string, Block>): Map<string, Layout>;
    static includeBlocks(content: string, blocks: Map<string, Block>): string;
    static buildPermalink(frontmatter: Frontmatter, format?: string): string;
    static slugify(text: string): string;
}
