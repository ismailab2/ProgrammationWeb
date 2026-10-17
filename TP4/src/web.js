import { createServer } from 'http';

process.loadEnvFile();
const host = process.env.HOST;
const port = process.env.PORT;

const server = createServer();

server.on('request', (req, res) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Salut tout le monde !\n');
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
});