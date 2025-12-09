const http = require('http');

// Basit HTTP servisi - Replit'i uyanık tutar
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('GhostBots is alive! 🤖\n');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`⚡ Keep-alive servisi ${PORT} portunda çalışıyor`);
});

module.exports = server;
