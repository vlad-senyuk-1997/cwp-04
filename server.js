const net = require('net');
const port = 8124;

const FIRST_REQUEST_STRING = "REMOTE";
const ACK_STRING = "ASC";
const DEC_STRING = "DEC";

const fs = require('fs');
const stream = require('stream');
const crypto = require('crypto');


const server = net.createServer((client) => {
        console.log('Client connected');

client.setEncoding('utf8');

client.on('data', (data) => {
    console.log(data);

    if (data === FIRST_REQUEST_STRING){
        client.write(ACK_STRING);
    }else if (data.indexOf("COPY") > -1){
        let urls = JSON.parse(data);
        fs.copyFileSync(urls[0], urls[1] + "/" + urls[0].split("/").pop());
        client.write("COPY-OK");
    }else if (data.indexOf("ENCODE") > -1){

    }
    else{
        client.write(DEC_STRING);
        client.destroy();
    }
});

client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});