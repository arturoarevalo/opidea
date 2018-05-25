import { Renderable, Site } from './interfaces';
import { FileUtilities } from '../helpers/file-utilities';
import { writeFileSync } from 'fs';

export class Renderer {

    static render(renderables: Renderable[]): void {
        console.log(renderables);

        Renderer.recreateFolder('./dist');

        for (const renderable of renderables) {
            FileUtilities.makeDirectoryRecursive('./dist/' + renderable.physicalFolder);
            writeFileSync('./dist/' + renderable.physicalFile, renderable.render(renderable.context));
        }
    }

    static recreateFolder(folder: string): void {
        FileUtilities.removeDirectoryRecursive(folder);
        FileUtilities.makeDirectoryRecursive(folder);
    }
}
