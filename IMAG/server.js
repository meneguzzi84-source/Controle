const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');

const port = process.env.PORT || 3000;
const username = process.env.AUTH_USER;
const password = process.env.AUTH_PASSWORD;
const publicDirectory = __dirname;
const dataDirectory = process.env.DATA_DIRECTORY || path.join(__dirname, 'data');
const chargesFile = path.join(dataDirectory, 'charges.json');

if (!username || !password) {
  console.error('Defina AUTH_USER e AUTH_PASSWORD antes de iniciar o servidor.');
  process.exit(1);
}

fs.mkdirSync(dataDirectory, { recursive: true });

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function credentialsMatch(value, expected) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return valueBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(valueBuffer, expectedBuffer);
}

function isAuthorized(request) {
  const authorization = request.headers.authorization || '';
  if (!authorization.startsWith('Basic ')) return false;

  const credentials = Buffer.from(authorization.slice(6), 'base64').toString('utf8');
  const separatorIndex = credentials.indexOf(':');
  if (separatorIndex === -1) return false;

  return credentialsMatch(credentials.slice(0, separatorIndex), username)
    && credentialsMatch(credentials.slice(separatorIndex + 1), password);
}

function sendJson(response, statusCode, value) {
  response.writeHead(statusCode, { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(value));
}

function readCharges() {
  try {
    return JSON.parse(fs.readFileSync(chargesFile, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) reject(new Error('Solicitação muito grande.'));
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function sendFile(requestPath, response) {
  const relativePath = requestPath === '/' ? 'Relatorio.html' : decodeURIComponent(requestPath).replace(/^\/+/, '');
  const filePath = path.resolve(publicDirectory, relativePath);

  if (!filePath.startsWith(`${publicDirectory}${path.sep}`)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Acesso negado.');
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(error.code === 'ENOENT' ? 'Arquivo não encontrado.' : 'Erro ao carregar o arquivo.');
      return;
    }

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(file);
  });
}

const server = http.createServer(async (request, response) => {
  if (!isAuthorized(request)) {
    response.writeHead(401, {
      'Content-Type': 'text/plain; charset=utf-8',
      'WWW-Authenticate': 'Basic realm="Relatorio privado", charset="UTF-8"',
    });
    response.end('Autenticação necessária.');
    return;
  }

  const requestPath = new URL(request.url, `http://${request.headers.host}`).pathname;

  if (requestPath === '/api/charges' && request.method === 'GET') {
    sendJson(response, 200, readCharges());
    return;
  }

  if (requestPath === '/api/charges' && request.method === 'PUT') {
    try {
      const charges = JSON.parse(await readRequestBody(request));
      if (!Array.isArray(charges)) throw new Error('Dados inválidos.');
      fs.writeFileSync(chargesFile, JSON.stringify(charges, null, 2));
      sendJson(response, 200, { saved: true });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  sendFile(requestPath, response);
});

server.listen(port, () => {
  console.log(`Relatório protegido disponível na porta ${port}.`);
});