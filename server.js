const net = require('net');
const port = 8124;

const FIRST_REQUEST_STRING = "REMOTE";
const ACK_STRING = "ASC";
const DEC_STRING = "DEC";

const server = net.createServer((client) => {
        console.log('Client connected');

client.setEncoding('utf8');

client.on('data', (data) => {
    console.log(data);

    if (data === FIRST_REQUEST_STRING){
        client.write(ACK_STRING);
    }else{
        client.write(DEC_STRING);
        client.destroy();
    }
});

client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});