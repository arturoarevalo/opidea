import { dirname } from 'path';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import * as Handlebars from 'handlebars';

export class TemplateRenderer {
    private static readonly templatesPath = dirname(require.main.filename) + '/templates/';

    private overwrite = false;

    render(templateName: string, context: any, outFile?: string | undefined): boolean {
        const source = readFileSync(TemplateRenderer.templatesPath + templateName + '.hbs', 'utf-8');
        const template = Handlebars.compile(source);
        const out = template(context);

        if (outFile !== undefined) {
            if (existsSync(outFile) && this.overwrite === false) {
                console.log('file', outFile, 'already exists, skipping (use --overwrite to force creation)');
                return false;
            } else {
                console.log('creating new file', outFile);
                writeFileSync(outFile, out, 'utf-8');
            }
        } else {
            console.log(out);
        }

        return true;
    }
}
