#!/usr/bin/env node

const http = require('node:http');
const https = require('node:https');

const relayPort = Number(process.env.RELAY_PORT || 18081);
const targetUrl = new URL(process.env.JENKINS_WEBHOOK_URL || 'http://127.0.0.1:18080/github-webhook/');
const httpClient = targetUrl.protocol === 'https:' ? https : http;

function toPath(url) {
  return `${url.pathname}${url.search || ''}`;
}

function forwardRequest(body, headers) {
  return new Promise((resolve, reject) => {
    const forwardHeaders = {};
    for (const [key, value] of Object.entries(headers)) {
      if (!value) continue;
      if (key === 'host' || key === 'connection' || key === 'content-length') continue;
      forwardHeaders[key] = value;
    }

    forwardHeaders['content-length'] = String(body.length);
    if (!forwardHeaders['content-type']) {
      forwardHeaders['content-type'] = 'application/json';
    }

    const req = httpClient.request(
      {
        protocol: targetUrl.protocol,
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: toPath(targetUrl),
        method: 'POST',
        headers: forwardHeaders,
        timeout: 15000,
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 502,
            headers: res.headers,
            body: Buffer.concat(chunks),
          });
        });
      }
    );

    req.on('timeout', () => req.destroy(new Error('upstream timeout')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));

  req.on('end', async () => {
    const body = Buffer.concat(chunks);

    try {
      const upstream = await forwardRequest(body, req.headers);
      res.writeHead(upstream.statusCode, {
        'content-type': 'text/plain; charset=utf-8',
      });
      res.end(`Forwarded to Jenkins: ${upstream.statusCode}`);

      const event = req.headers['x-github-event'] || 'unknown';
      const delivery = req.headers['x-github-delivery'] || 'n/a';
      console.log(`[relay] ${event} delivery=${delivery} -> ${upstream.statusCode}`);
    } catch (error) {
      res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Bad Gateway');
      console.error(`[relay] forward failed: ${error.message}`);
    }
  });
});

server.listen(relayPort, '127.0.0.1', () => {
  console.log(`[relay] listening on http://127.0.0.1:${relayPort}`);
  console.log(`[relay] forwarding to ${targetUrl.toString()}`);
});
