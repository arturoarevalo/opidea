import { Piece } from './piece';
import { Theme } from './theme';
export declare class Loader {
    static loadTheme(name: string): Theme;
    static loadPieces(theme: Theme): Piece[];
    private static getLoadEntryPoints(theme);
    private static loadPiecesInFolder(folder, initialMatter?);
}
