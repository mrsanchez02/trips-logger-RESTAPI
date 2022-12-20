const http = require('http');
const app = require('./app');
const database = require('./config/database');

const server = http.createServer(app);

database();
server.listen(3000);

server.on('listening', () => {
  console.log('Server listening on port 3000');
});