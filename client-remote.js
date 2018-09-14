const net = require('net');
const port = 8124;

const client = new net.Socket();

const FIRST_REQUEST_STRING = "REMOTE";
const ACK_STRING = "ASC";
const DEC_STRING = "DEC";

client.setEncoding('utf8');

client.connect(port, function() {
    console.log('Connected');
    client.write(FIRST_REQUEST_STRING);
});

client.on('data', function(data) {
    console.log(data);
    client.destroy();
});

client.on('close', function() {
    console.log('Connection closed');
});