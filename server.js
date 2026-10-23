/**
 * Servidor HTTP Nativo em Node.js (Zero Dependências Obrigatórias)
 * Serve os arquivos HTML, CSS e JS estáticos e expõe a API do Assistente IA
 * Plataforma Aprendizagem Jovem
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5173;

// Tipos MIME suportados
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Endpoint de API da IA: /api/ai/assistant
  if (req.url === '/api/ai/assistant' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const userMsg = payload.message || '';
        const youthName = payload.youthName || 'Jovem Aprendiz';

        // Respostas contextuais pedagógicas
        let reply = `Excelente ponto, ${youthName}! Em uma entrevista para Jovem Aprendiz, sua determinação para aprender e sua pontualidade são os fatores mais valorizados.`;
        const lower = userMsg.toLowerCase();

        if (lower.includes('entrevista') || lower.includes('comportar')) {
          reply = `Dica de ouro para sua entrevista, ${youthName}:\n1. Chegue com antecedência e vista-se de maneira confortável e profissional.\n2. Demonstre que você já está se capacitando na plataforma Aprendizagem Jovem.\n3. Estruture suas respostas usando Situação, Ação e Resultado.\n\nQuer simular uma pergunta real agora?`;
        } else if (lower.includes('currículo') || lower.includes('experiência')) {
          reply = `Mesmo sem experiência formal, seu currículo ganha destaque ao listar as competências que você está desenvolvendo na Aprendizagem Jovem (Excel, Atendimento, Comunicação) e sua ofensiva diária de estudos!`;
        } else if (lower.includes('excel')) {
          reply = `Para vagas administrativas, domine as funções SOMA, MÉDIA, SE e PROCV/PROCX. Pratique na aba "Cursos" para ganhar pontos no Clube e garantir 100% de Match com as empresas parceiras!`;
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ reply, source: 'aprendizagem-jovem-ai-assistant' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Payload inválido' }));
      }
    });
    return;
  }

  // Roteamento de Arquivos Estáticos
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '/login' || reqPath === '/dashboard') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback SPA para index.html
        fs.readFile(path.join(__dirname, 'index.html'), (errIndex, indexContent) => {
          if (errIndex) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Página não encontrada.');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(indexContent);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Erro no servidor: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🎓 Aprendizagem Jovem (MVP HTML/CSS/JS)`);
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
  console.log(`Pressione Ctrl+C para encerrar.`);
  console.log(`======================================================\n`);
});
