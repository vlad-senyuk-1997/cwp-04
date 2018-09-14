const net = require('net');
const port = 8124;

const FIRST_REQUEST_STRING = "REMOTE";
const ACK_STRING = "ASC";
const DEC_STRING = "DEC";

const fs = require('fs');
const crypto = require('crypto'), algorithm = 'aes256';

function encrypt(text, password){
    let cipher = crypto.createCipher(algorithm,password)
    let crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text, password){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

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
        let urls = JSON.parse(data);

        // READ

        let dat = '';
        let rstream = fs.createReadStream(urls[0]);
        rstream.setEncoding('UTF8');

        rstream.on('data', function(chunk) {
            dat += chunk;
        });

        rstream.on('end',function(){
            console.log(dat);
        });

        rstream.on('error', function(err){
            console.log(err.stack);
        });
        console.log("Read Ended");

        // WRITE

        let wstream = fs.createWriteStream(urls[1] + "/" + "enc-" +  urls[0].split("/").pop());
        wstream.write(encrypt(dat, urls[3]),'UTF8');
        wstream.end();

        wstream.on('finish', function() {
            console.log("Write completed.");
        });

        wstream.on('error', function(err){
            console.log(err.stack);
        });

        console.log("Write Ended");

        client.write("ENCODE-OK");
    }else if (data.indexOf("UNDO") > -1){
        let urls = JSON.parse(data);

        // READ

        let dat = '';
        let rstream = fs.createReadStream(urls[1] + "/" + "enc-" +  urls[0].split("/").pop());
        rstream.setEncoding('UTF8');

        rstream.on('data', function(chunk) {
            dat += chunk;
        });

        rstream.on('end',function(){
            console.log(dat);
        });

        rstream.on('error', function(err){
            console.log(err.stack);
        });
        console.log("Read Ended");

        // WRITE

        let wstream = fs.createWriteStream(urls[1] + "/" + "dec-" +  urls[0].split("/").pop());
        wstream.write(decrypt(dat, urls[3]),'UTF8');
        wstream.end();

        wstream.on('finish', function() {
            console.log("Write completed.");
        });

        wstream.on('error', function(err){
            console.log(err.stack);
        });

        console.log("Write Ended");

        client.write(DEC_STRING);
    } else{
        client.write(DEC_STRING);
        client.destroy();
    }
});

client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});