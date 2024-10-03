import * as http from "http";
import TokenDecoder from "../decoding/TokenDecoder";
import DnsManagement from "../domains/DnsManagement";
import config from "../config/Config";

const isLocalIp = (ip: string) => {
    return ip === '::1' || ip === '::ffff:';
}

const parseJsonBody = (req: http.IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
    });
}

export const startServer = async () => {
    const server = http.createServer(async (req: any, res: any) => {
        const ip = req.connection.remoteAddress;
        const endpoint = req.url;
        const method = req.method;

        console.log(`Request from ${ip} to ${method} ${endpoint}`);

        if (endpoint === '/update_address' && method === 'POST') {
            try {
                const data = await parseJsonBody(req);

                const token = data.token;

                if (!token) {
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end('Token is required');
                    return;
                }

                const decodedToken = TokenDecoder.decodeToken(token);
                if (!decodedToken) {
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end('Invalid token');
                    return;
                }

                const address = data.address ?? ip;
                if (!address) {
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end('Address is required');
                    return;
                }

                const domain = config.domains.find(d => d.id === decodedToken.domain);
                if (!domain) {
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end('Invalid domain');
                    return;
                }

                await DnsManagement.createOrUpdateARecord(domain.zone_id, domain.id, address);

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('OK');

            } catch (e) {
                console.error(e);
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Invalid JSON');
            }
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found');
        }
    });

    server.listen(config.port);
    console.log(`Server running at http://localhost:${config.port}/`);
}