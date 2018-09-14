const net = require('net');
const port = 8124;

const client = new net.Socket();

const FIRST_REQUEST_STRING = "REMOTE";
const ACK_STRING = "ASC";
const DEC_STRING = "DEC";

const urls = [process.argv[2], process.argv[3]];

client.setEncoding('utf8');

client.connect(port, function() {
    console.log('Connected');
    client.write(FIRST_REQUEST_STRING);
});

client.on('data', function(data) {
    console.log(data);

    if (data === ACK_STRING){
        if (urls.length > 0){
            client.write(JSON.stringify(urls));
        }
    }else if (data === DEC_STRING){
        client.destroy();
    }
});

client.on('close', function() {
    console.log('Connection closed');
});