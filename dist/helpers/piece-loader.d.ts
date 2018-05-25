import { Frontmatter } from './frontmatter';
import { Piece } from './piece';
export declare class PieceLoader {
    static load(folder: string, initialMatter?: Frontmatter): Iterable<Piece>;
}
