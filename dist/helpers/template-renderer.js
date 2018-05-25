"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const Handlebars = require("handlebars");
class TemplateRenderer {
    constructor() {
        this.overwrite = false;
    }
    render(templateName, context, outFile) {
        const source = fs_1.readFileSync(TemplateRenderer.templatesPath + templateName + '.hbs', 'utf-8');
        const template = Handlebars.compile(source);
        const out = template(context);
        if (outFile !== undefined) {
            if (fs_1.existsSync(outFile) && this.overwrite === false) {
                console.log('file', outFile, 'already exists, skipping (use --overwrite to force creation)');
                return false;
            }
            else {
                console.log('creating new file', outFile);
                fs_1.writeFileSync(outFile, out, 'utf-8');
            }
        }
        else {
            console.log(out);
        }
        return true;
    }
}
TemplateRenderer.templatesPath = path_1.dirname(require.main.filename) + '/templates/';
exports.TemplateRenderer = TemplateRenderer;
