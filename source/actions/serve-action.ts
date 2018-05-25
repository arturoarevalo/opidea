import { CommanderStatic } from 'commander';
import * as http from 'http';
import * as Static from 'node-static';
import { Action } from './action';
import { format } from 'util';

export class ServeAction extends Action {
    register(program: CommanderStatic): void {
        program
            .command('serve [port]')
            .description('Instantiates a HTTP server on the specified port (default 8080')
            .action(async (port?: string) => {
                await this.execute(port ? parseInt(port, 10) : 8080);
            });
    }

    async execute(port: number): Promise<void> {
        const staticServer = new Static.Server('./dist');

        http.createServer((req, res) => {
            req.addListener('end', () => {
                console.log(format('requested %s', req.url));
                staticServer.serve(req, res);
            }).resume();
        }).listen(port, () => {
            console.log();
            console.log(format('Server listening on http://localhost:%d', port));
            console.log('Press CTRL+C to stop server');
            console.log();
        });
    }
}
