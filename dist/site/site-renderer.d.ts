import { Renderable, Site } from './interfaces';
export declare class Renderer {
    render(site: Site, renderables: Renderable[]): void;
    recreateFolder(folder: string): void;
}
