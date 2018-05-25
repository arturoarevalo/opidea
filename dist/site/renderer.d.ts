import { Renderable } from './interfaces';
export declare class Renderer {
    static render(renderables: Renderable[]): void;
    static recreateFolder(folder: string): void;
}
