"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Static = require("node-static");
const action_1 = require("./action");
const util_1 = require("util");
class ServeAction extends action_1.Action {
    register(program) {
        program
            .command('serve [port]')
            .description('Instantiates a HTTP server on the specified port (default 8080')
            .action(async (port) => {
            await this.execute(port ? parseInt(port, 10) : 8080);
        });
    }
    async execute(port) {
        const staticServer = new Static.Server('./dist');
        http.createServer((req, res) => {
            req.addListener('end', () => {
                console.log(util_1.format('requested %s', req.url));
                staticServer.serve(req, res);
            }).resume();
        }).listen(port, () => {
            console.log();
            console.log(util_1.format('Server listening on http://localhost:%d', port));
            console.log('Press CTRL+C to stop server');
            console.log();
        });
    }
}
exports.ServeAction = ServeAction;
