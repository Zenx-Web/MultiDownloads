const http = require('http');

const port = Number(process.env.TEST_FILE_PORT || 8099);

// Small deterministic payload.
const body = Buffer.from('TEST_MEDIA_PAYLOAD_' + 'x'.repeat(1024), 'utf8');

const server = http.createServer((req, res) => {
  if (req.url === '/media.bin') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', String(body.length));
    res.end(body);
    return;
  }
  res.statusCode = 404;
  res.end('not found');
});

server.listen(port, '127.0.0.1', () => {
  // eslint-disable-next-line no-console
  console.log(`test file server listening on ${port}`);
});
