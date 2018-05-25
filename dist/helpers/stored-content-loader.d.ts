import { Piece } from './piece';
import { Frontmatter } from './frontmatter';
export declare class PieceLoader {
    static load(folder: string, initialMatter?: Frontmatter): Iterable<Piece>;
}
