import Debug from 'debug';
import { setTimeout, clearTimeout } from 'node:timers';
import http from 'node:http';
import querystring from 'node:querystring';
import open from 'open';

const debug = Debug('mobbdev:web-login');

export async function callbackServer(url, redirectUrl) {
    debug('web login start');

    let responseResolver;
    let responseRejecter;
    const responseAwaiter = new Promise((resolve, reject) => {
        responseResolver = resolve;
        responseRejecter = reject;
    });
    const timerHandler = setTimeout(() => {
        debug('timeout happened');
        responseRejecter(new Error('No login happened in three minutes.'));
    }, 180000);

    const server = http.createServer((req, res) => {
        debug('incoming request');
        let body = '';

        req.on('data', (chunk) => {
            debug('http server get chunk %s', chunk);
            body += chunk;
        });

        req.on('end', () => {
            debug('http server end %s', body);
            res.writeHead(301, {
                Location: redirectUrl,
            }).end();

            responseResolver(querystring.parse(body));
        });
    });

    debug('http server starting');
    const port = await new Promise((resolve) => {
        server.listen(0, '127.0.0.1', () => {
            resolve(server.address().port);
        });
    });
    debug('http server started on port %d', port);

    debug('opening the browser on %s', `${url}?port=${port}`);
    await open(`${url}?port=${port}`);

    try {
        debug('waiting for http request');
        return await responseAwaiter;
    } finally {
        debug('http server close');
        clearTimeout(timerHandler);
        server.close();
    }
}
